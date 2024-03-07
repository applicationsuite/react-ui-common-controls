export declare const FILE_EXTENSIONS: {
    TXT: string;
    CSV: string;
    XLS: string;
    XLSX: string;
    XML: string;
    DOC: string;
    DOCX: string;
    PPT: string;
    PPTX: string;
    ZIP: string;
    EMAIL: string;
    PDF: string;
};
export declare const FILE_UPLOAD_CONSTANTS: {
    DROP_HERE_FILE_TO_UPLOAD: string;
    DROP_MSG: string;
    BROWSE_MSG: string;
    BROWSE_YOUR_FILES: string;
    FILE_UPLOAD: string;
    NONE: string;
    UPLOAD_FILE_LIST_HEIGHT: number;
};
export declare const DEFAULT_FILE_MAX_SIZE = 5000000;
export declare enum FileUploaderType {
    DropZone = 0,
    BrowseLink = 1
}
export declare enum FileReadType {
    Text = 0,
    Binary = 1,
    ArrayBuffer = 2,
    DataURL = 3
}
export declare enum FileUploadState {
    NotStarted = 0,
    InProgress = 1,
    Error = 2,
    Complete = 3
}
export declare enum FileUploadError {
    None = 0,
    MaxSizeExceeded = 1,
    IncorrectFileType = 2,
    FileNameAlreadyAdded = 3,
    UploadFailed = 4,
    ParsingFailed = 5
}
export declare const FILE_UPLOAD_ERRORS: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
};
export interface IFileUploadProps {
    maxFiles?: number;
    maxFileSize?: number;
    readType?: FileReadType;
    fileTypes?: string[];
    fileParsers?: any;
    triggerFileLoadRef?: any;
    selectedFiles?: IFileInfo[];
    onChange?: (files: IFileInfo[], e?: any) => void;
    onValidate?: (files: IFileInfo[]) => boolean;
    onLoad?: (data: IFileInfo[]) => void;
    className?: string;
    ariaLabel?: string;
    id?: string;
    name?: string;
    style?: any;
    ref?: any;
}
export interface IFileInfo extends File {
    id: string;
    extension?: string;
    URI?: string;
    content?: any;
    parsedContent?: any;
    uploadState?: FileUploadState;
    uploadError: FileUploadError;
    formData?: FormData;
}
export interface IFileUploaderProps {
    uploaderType?: FileUploaderType;
    maxFiles?: number;
    maxFileSize?: number;
    fileTypes?: string[];
    onChange?: (files: IFileInfo[]) => void;
    onDownload?: (files: IFileInfo[]) => void;
    disableFileRead?: boolean;
    readType?: FileReadType;
    fileParsers?: any;
    disableFileSelection?: boolean;
    hideFileUpload?: boolean;
    hideFileUploadList?: boolean;
    fileUploadListHeight?: number;
    selectedFiles?: IFileInfo[];
    disableFileRemove?: boolean;
    hideFileUploadStatusColumn?: boolean;
    FileUploadListComponent?: any;
    onRenderFileNameColumn?: (item: any) => any;
    browseMessage?: string;
    fileDropMessage?: string;
    className?: string;
    fileDropZoneContainerClass?: string;
    browseLinkClass?: string;
    fileListContainerClass?: string;
}
export interface IFileUploadListProps {
    selectedFiles: any[];
    fileUploadListHeight?: number;
    hideFileUploadStatus?: boolean;
    onRenderFileNameColumn?: (item: any) => any;
    onRemove?: (item: any) => void;
    onDownLoad?: (item: any) => void;
    fileListContainerClass?: string;
    fileListGridClass?: string;
}
