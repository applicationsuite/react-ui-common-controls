var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileUploadError, FileUploadState } from '.';
import { FileReadType, DEFAULT_FILE_MAX_SIZE } from './FileUpload.models';
export const getUpdatedFiles = (files = [], fileTypes = [], maxFileSize, selectedFiles = []) => {
    try {
        let fileList = [];
        for (let i = 0; i < files.length; i++) {
            let fileName = files[i].name;
            try {
                files[i].extension =
                    '.' + fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
            }
            catch (_a) {
                files[i].extension = '';
            }
            files[i].uploadError = files[i].uploadError || FileUploadError.None;
            files[i].uploadState = files[i].uploadState || FileUploadState.NotStarted;
            files[i].id = files[i].id || (new Date().getUTCMilliseconds() + i).toString();
            const formData = new FormData();
            formData.append('userfile', files[i], files[i].name);
            files[i].formData = files[i].formData || formData;
            validateFile(files[i], fileTypes, maxFileSize, selectedFiles);
            fileList.push(files[i]);
        }
        return fileList;
    }
    catch (e) {
        return [];
    }
};
export const readFile = (file, readType) => __awaiter(void 0, void 0, void 0, function* () {
    let promise = new Promise(function (resolve, reject) {
        let reader = new FileReader();
        reader.onload = (e) => __awaiter(this, void 0, void 0, function* () {
            let fileContent = e ? e.target.result : reader.content;
            resolve(fileContent);
        });
        reader.onprogress = (e) => __awaiter(this, void 0, void 0, function* () {
            file.uploadState = FileUploadState.InProgress;
        });
        reader.loadend = (e) => __awaiter(this, void 0, void 0, function* () {
            file.uploadState = FileUploadState.Complete;
        });
        reader.onerror = (e) => __awaiter(this, void 0, void 0, function* () {
            file.uploadState = FileUploadState.Error;
            file.uploadError = FileUploadError.UploadFailed;
            reject(e);
        });
        switch (readType) {
            case FileReadType.Text:
                reader.readAsText(file);
                break;
            case FileReadType.Binary:
                reader.readAsBinaryString(file);
                break;
            case FileReadType.ArrayBuffer:
                reader.readAsArrayBuffer(file);
                break;
            case FileReadType.DataURL:
                reader.readAsDataURL(file);
                break;
            default:
                reader.readAsBinaryString(file);
        }
    });
    return promise;
});
export const loadFiles = (files, fileParsers) => __awaiter(void 0, void 0, void 0, function* () {
    const filesLoaded = yield readFiles(files);
    if (fileParsers) {
        return yield parseFiles(filesLoaded, fileParsers);
    }
    return filesLoaded;
});
export const readFiles = (files) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (file.uploadError === FileUploadError.None) {
                file.content = yield readFile(file);
                file.uploadState = FileUploadState.Complete;
                file.uploadError = FileUploadError.None;
            }
        }
        catch (e) {
            file.uploadError = FileUploadError.UploadFailed;
            file.uploadState = FileUploadState.Error;
        }
        return file;
    })));
});
export const parseFiles = (files, fileParsers) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (file.uploadError === FileUploadError.None) {
                file.parsedContent = yield parseFile(file, fileParsers);
                file.uploadState = FileUploadState.Complete;
                file.uploadError = FileUploadError.None;
            }
        }
        catch (e) {
            file.uploadError = FileUploadError.ParsingFailed;
            file.uploadState = FileUploadState.Error;
        }
        return file;
    })));
});
export const parseFile = (file, fileParsers) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file.extension) {
        let fileName = file.name;
        file.extension = '.' + fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
    }
    let fileParser = fileParsers && fileParsers[file.extension];
    let promise = new Promise(function (resolve, reject) {
        if (fileParser) {
            try {
                file.uploadState = FileUploadState.InProgress;
                let parser = fileParser(file.content);
                if (parser.then) {
                    parser.then((data) => {
                        file.uploadState = FileUploadState.Complete;
                        resolve(data);
                    }, (e) => {
                        file.uploadError = FileUploadError.ParsingFailed;
                        file.uploadState = FileUploadState.Error;
                        reject(e);
                    });
                }
                else {
                    let data = parser(file.content);
                    file.uploadState = FileUploadState.Complete;
                    resolve(data);
                }
            }
            catch (e) {
                file.uploadError = FileUploadError.ParsingFailed;
                file.uploadState = FileUploadState.Error;
                reject(e);
            }
        }
        else {
            resolve(undefined);
        }
    });
    return promise;
});
export const validateFile = (file, fileTypes, maxSizeInMB, selectedFiles) => {
    if (file.extension && !fileTypes.includes(file.extension)) {
        file.uploadError = FileUploadError.IncorrectFileType;
        file.uploadState = FileUploadState.Error;
        return false;
    }
    const MAX_FILE_SIZE = maxSizeInMB ? maxSizeInMB * 1000000 : DEFAULT_FILE_MAX_SIZE;
    if (file.size && file.size >= MAX_FILE_SIZE) {
        file.uploadError = FileUploadError.MaxSizeExceeded;
        file.uploadState = FileUploadState.Error;
        return false;
    }
    if (selectedFiles && selectedFiles.length) {
        let isExist = selectedFiles.some((selectedFile) => selectedFile.name === file.name && selectedFile.uploadState !== FileUploadState.NotStarted);
        if (isExist) {
            file.uploadError = FileUploadError.FileNameAlreadyAdded;
            file.uploadState = FileUploadState.Error;
            return false;
        }
    }
};
export const validateFiles = (files = [], fileTypes = [], maxFileSize = undefined, selectedFiles = []) => {
    files.forEach((file) => {
        file.uploadError = FileUploadError.None;
        validateFile(file, fileTypes, maxFileSize, selectedFiles);
    });
};
export const readFileAsArrayBuffer = (fileContent) => __awaiter(void 0, void 0, void 0, function* () {
    let promise = new Promise(function (resolve, reject) {
        let reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = reader.result;
            let fileByteArray = [];
            var bytes = new Uint8Array(arrayBuffer);
            for (var i = 0; i < bytes.length; i++) {
                fileByteArray.push(bytes[i]);
            }
            resolve(fileByteArray);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(fileContent);
    });
    return promise;
});
if (!FileReader.prototype.readAsBinaryString) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
        let binary = '';
        let fileUploadElement = this;
        let reader = new FileReader();
        reader.onload = function (e) {
            let bytes = new Uint8Array(reader.result);
            let length = bytes.byteLength;
            for (let i = 0; i < length; i++) {
                let a = bytes[i];
                let b = String.fromCharCode(a);
                binary += b;
            }
            fileUploadElement.content = binary;
            fileUploadElement.onload();
        };
        reader.readAsArrayBuffer(fileData);
    };
}
