import { FileUploadError, FileUploadState } from '.';
import { FileReadType, IFileInfo, DEFAULT_FILE_MAX_SIZE } from './FileUpload.models';

export const getUpdatedFiles = (
  files: IFileInfo[] = [],
  fileTypes: string[] = [],
  maxFileSize?: number,
  selectedFiles: IFileInfo[] = []
) => {
  try {
    let fileList: IFileInfo[] = [];
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].name;
      try {
        files[i].extension =
          '.' + fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
      } catch {
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
  } catch (e: any) {
    return [];
  }
};

export const readFile = async (file: IFileInfo, readType?: FileReadType) => {
  let promise = new Promise(function (resolve: any, reject: any) {
    let reader: any = new FileReader();
    reader.onload = async (e: any) => {
      let fileContent = e ? e.target.result : reader.content;
      resolve(fileContent);
    };
    reader.onprogress = async (e: any) => {
      file.uploadState = FileUploadState.InProgress;
    };
    reader.loadend = async (e: any) => {
      file.uploadState = FileUploadState.Complete;
    };
    reader.onerror = async (e: any) => {
      file.uploadState = FileUploadState.Error;
      file.uploadError = FileUploadError.UploadFailed;
      reject(e);
    };
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
};

export const loadFiles = async (files: IFileInfo[], fileParsers: any) => {
  const filesLoaded = await readFiles(files);
  if (fileParsers) {
    return await parseFiles(filesLoaded, fileParsers);
  }
  return filesLoaded;
};

export const readFiles = async (files: IFileInfo[]) => {
  return Promise.all(
    files.map(async (file: IFileInfo) => {
      try {
        if (file.uploadError === FileUploadError.None) {
          file.content = await readFile(file);
          file.uploadState = FileUploadState.Complete;
          file.uploadError = FileUploadError.None;
        }
      } catch (e: any) {
        file.uploadError = FileUploadError.UploadFailed;
        file.uploadState = FileUploadState.Error;
      }
      return file;
    })
  );
};

export const parseFiles = async (files: IFileInfo[], fileParsers: any) => {
  return Promise.all(
    files.map(async (file: IFileInfo) => {
      try {
        if (file.uploadError === FileUploadError.None) {
          file.parsedContent = await parseFile(file, fileParsers);
          file.uploadState = FileUploadState.Complete;
          file.uploadError = FileUploadError.None;
        }
      } catch (e: any) {
        file.uploadError = FileUploadError.ParsingFailed;
        file.uploadState = FileUploadState.Error;
      }
      return file;
    })
  );
};

export const parseFile = async (file: IFileInfo, fileParsers: any) => {
  if (!file.extension) {
    let fileName = file.name;
    file.extension = '.' + fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
  }
  let fileParser = fileParsers && fileParsers[file.extension!];
  let promise = new Promise(function (resolve: any, reject: any) {
    if (fileParser) {
      try {
        file.uploadState = FileUploadState.InProgress;
        let parser = fileParser(file.content);
        if (parser.then) {
          parser.then(
            (data: any) => {
              file.uploadState = FileUploadState.Complete;
              resolve(data);
            },
            (e: any) => {
              file.uploadError = FileUploadError.ParsingFailed;
              file.uploadState = FileUploadState.Error;
              reject(e);
            }
          );
        } else {
          let data = parser(file.content);
          file.uploadState = FileUploadState.Complete;
          resolve(data);
        }
      } catch (e: any) {
        file.uploadError = FileUploadError.ParsingFailed;
        file.uploadState = FileUploadState.Error;
        reject(e);
      }
    } else {
      resolve(undefined);
    }
  });
  return promise;
};

export const validateFile = (
  file: IFileInfo,
  fileTypes: string[],
  maxSizeInMB?: number,
  selectedFiles?: IFileInfo[]
) => {
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
    let isExist = selectedFiles.some(
      (selectedFile) =>
        selectedFile.name === file.name && selectedFile.uploadState !== FileUploadState.NotStarted
    );
    if (isExist) {
      file.uploadError = FileUploadError.FileNameAlreadyAdded;
      file.uploadState = FileUploadState.Error;
      return false;
    }
  }
};

export const validateFiles = (
  files: IFileInfo[] = [],
  fileTypes: string[] = [],
  maxFileSize = undefined,
  selectedFiles: IFileInfo[] = []
) => {
  files.forEach((file) => {
    file.uploadError = FileUploadError.None;
    validateFile(file, fileTypes, maxFileSize, selectedFiles);
  });
};

export const readFileAsArrayBuffer = async (fileContent: any) => {
  let promise = new Promise(function (resolve: any, reject: any) {
    let reader = new FileReader();
    reader.onload = function () {
      var arrayBuffer: any = reader.result;
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
};

if (!FileReader.prototype.readAsBinaryString) {
  FileReader.prototype.readAsBinaryString = function (fileData) {
    let binary: string = '';
    let fileUploadElement: any = this;
    let reader: any = new FileReader();

    reader.onload = function (e: any) {
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
