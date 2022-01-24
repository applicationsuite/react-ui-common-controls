export const FILE_EXTENSIONS = {
    TXT: '.txt',
    CSV: '.csv',
    XLS: '.xls',
    XLSX: '.xlsx',
    XML: '.xml',
    DOC: '.doc',
    DOCX: '.docx',
    PPT: '.ppt',
    PPTX: '.pptx',
    ZIP: '.zip',
    EMAIL: '.msg',
    PDF: '.pdf'
};
export const FILE_UPLOAD_CONSTANTS = {
    DROP_HERE_FILE_TO_UPLOAD: 'quote:: Drop files here to upload',
    DROP_MSG: 'Drop the files to upload',
    BROWSE_MSG: 'Browse',
    BROWSE_YOUR_FILES: 'browse your files',
    FILE_UPLOAD: 'fileUpload',
    NONE: 'none',
    UPLOAD_FILE_LIST_HEIGHT: 300
};
export const DEFAULT_FILE_MAX_SIZE = 5000000; //5 MB;
export var FileUploaderType;
(function (FileUploaderType) {
    FileUploaderType[FileUploaderType["DropZone"] = 0] = "DropZone";
    FileUploaderType[FileUploaderType["BrowseLink"] = 1] = "BrowseLink";
})(FileUploaderType || (FileUploaderType = {}));
export var FileReadType;
(function (FileReadType) {
    FileReadType[FileReadType["Text"] = 0] = "Text";
    FileReadType[FileReadType["Binary"] = 1] = "Binary";
    FileReadType[FileReadType["ArrayBuffer"] = 2] = "ArrayBuffer";
    FileReadType[FileReadType["DataURL"] = 3] = "DataURL";
})(FileReadType || (FileReadType = {}));
export var FileUploadState;
(function (FileUploadState) {
    FileUploadState[FileUploadState["NotStarted"] = 0] = "NotStarted";
    FileUploadState[FileUploadState["InProgress"] = 1] = "InProgress";
    FileUploadState[FileUploadState["Error"] = 2] = "Error";
    FileUploadState[FileUploadState["Complete"] = 3] = "Complete";
})(FileUploadState || (FileUploadState = {}));
export var FileUploadError;
(function (FileUploadError) {
    FileUploadError[FileUploadError["None"] = 0] = "None";
    FileUploadError[FileUploadError["MaxSizeExceeded"] = 1] = "MaxSizeExceeded";
    FileUploadError[FileUploadError["IncorrectFileType"] = 2] = "IncorrectFileType";
    FileUploadError[FileUploadError["FileNameAlreadyAdded"] = 3] = "FileNameAlreadyAdded";
    FileUploadError[FileUploadError["UploadFailed"] = 4] = "UploadFailed";
    FileUploadError[FileUploadError["ParsingFailed"] = 5] = "ParsingFailed";
})(FileUploadError || (FileUploadError = {}));
export const FILE_UPLOAD_ERRORS = {
    [FileUploadError.None]: '',
    [FileUploadError.MaxSizeExceeded]: 'Max size Exceeded',
    [FileUploadError.IncorrectFileType]: 'Incorrect file type',
    [FileUploadError.FileNameAlreadyAdded]: 'File Name already exists',
    [FileUploadError.UploadFailed]: 'File upload failed',
    [FileUploadError.ParsingFailed]: 'File parsing failed'
};
