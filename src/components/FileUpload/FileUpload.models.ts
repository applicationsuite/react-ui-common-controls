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

export enum FileUploaderType {
  DropZone = 0,
  BrowseLink = 1
}

export enum FileReadType {
  Text = 0,
  Binary = 1,
  ArrayBuffer = 2,
  DataURL = 3
}

export enum FileUploadState {
  NotStarted = 0,
  InProgress = 1,
  Error = 2,
  Complete = 3
}

export enum FileUploadError {
  None = 0,
  MaxSizeExceeded = 1,
  IncorrectFileType = 2,
  FileNameAlreadyAdded = 3,
  UploadFailed = 4,
  ParsingFailed = 5
}

export const FILE_UPLOAD_ERRORS = {
  [FileUploadError.None]: '',
  [FileUploadError.MaxSizeExceeded]: 'Max size Exceeded',
  [FileUploadError.IncorrectFileType]: 'Incorrect file type',
  [FileUploadError.FileNameAlreadyAdded]: 'File Name already exists',
  [FileUploadError.UploadFailed]: 'File upload failed',
  [FileUploadError.ParsingFailed]: 'File parsing failed'
};

export interface IFileUploadProps {
  maxFiles?: number;
  maxFileSize?: number; //in MB - Default: 5MB
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

  //If the files needs to be read, then provide these data
  disableFileRead?: boolean; //whether to read file or not
  readType?: FileReadType; //how file will be read
  fileParsers?: any; //after file is read, if you need to parse the raw content to JSON
  disableFileSelection?: boolean;
  hideFileUpload?: boolean;

  //File Upload list props
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
  fileListGridClass? : string;
}
