import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import {
  IFileUploaderProps,
  FileUpload,
  IFileInfo,
  FileUploaderType,
  FILE_UPLOAD_CONSTANTS,
  FileUploadState
} from '..';
import { mergeClassNames } from '../../../utilities/mergeClassNames';
import { fileUploaderStyles } from './FileUploader.styles';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { FileUploadList } from './FileUploadList';
import { getUpdatedFiles, loadFiles } from '../fileUploadUtils';

const useStyles = createUseStyles(fileUploaderStyles);

export const FileUploader: React.FC<IFileUploaderProps> = (props) => {
  const { FileUploadListComponent } = props;
  const classes = useStyles();
  const [files, setFiles] = useState(props.selectedFiles || []);
  const [inDropZone, setInDropZone] = React.useState<boolean>(false);

  React.useEffect(() => {
    let updatedFiles = getUpdatedFiles(props.selectedFiles || []);
    setFiles(updatedFiles);
  }, [props.selectedFiles]);

  const onFileUploadChange = (fileList: IFileInfo[]) => {
    if (!props.disableFileRead) {
      fileList
        .filter((item) => item.uploadState !== FileUploadState.Error)
        .forEach((file) => {
          file.uploadState = FileUploadState.InProgress;
        });
    }
    const updatedFileList = files.concat(fileList);
    setFiles(updatedFileList || []);
    props.disableFileRead && props.onChange && props.onChange(updatedFileList);
  };

  const onLoad = (fileList: IFileInfo[]) => {
    const updatedFileList = files.concat(fileList);
    setFiles(updatedFileList || []);
    props.onChange && props.onChange(updatedFileList);
  };

  const onRemoveFile = (file: IFileInfo) => {
    const filterFiles = files.filter((item) => item.id !== file.id);
    setFiles(filterFiles || []);
    props.onChange && props.onChange(filterFiles);
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setInDropZone(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setInDropZone(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setInDropZone(true);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const fileList = e.dataTransfer.files;
    loadDroppedFiles(fileList);
    setInDropZone(false);
  };

  const loadDroppedFiles = async (list: FileList) => {
    const array: any[] = [];
    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    let fileList = array.filter((x) => !!x);

    const maxFiles = props.maxFiles || 1;
    if (fileList.length > maxFiles) {
      fileList.splice(maxFiles, fileList.length);
    }

    let fileData = getUpdatedFiles(fileList, props.fileTypes, props.maxFileSize, files);
    fileData
      .filter((item) => item.uploadState !== FileUploadState.Error)
      .forEach((file) => {
        file.uploadState = FileUploadState.InProgress;
      });
    let updatedFileList = files.concat(fileData);
    setFiles(updatedFileList);

    const filesContent = await loadFiles(fileData, props.fileParsers);
    filesContent.forEach((file) => {
      let index = updatedFileList.findIndex((item) => item.id === file.id);
      updatedFileList[index] = file;
    });
    setFiles(updatedFileList);
    props.onChange && props.onChange!(updatedFileList);
  };

  const getfileDropZone = () => {
    const dropZoneClass = inDropZone ? classes.fileDropZoneActive : classes.fileDropZone;
    const textClassName = inDropZone ? classes.initialTextActive : classes.initialText;
    const browseMsg = props.browseMessage || FILE_UPLOAD_CONSTANTS.BROWSE_YOUR_FILES;
    const text = inDropZone
      ? FILE_UPLOAD_CONSTANTS.DROP_HERE_FILE_TO_UPLOAD
      : props.fileDropMessage || FILE_UPLOAD_CONSTANTS.DROP_MSG;
    const isUploadAllowed = !props.disableFileSelection && files.length < (props.maxFiles || 1);
    return (
      <div
        className={mergeClassNames([dropZoneClass, props.fileDropZoneContainerClass])}
        onDragEnter={isUploadAllowed ? handleDragEnter : undefined}
        onDragLeave={isUploadAllowed ? handleDragLeave : undefined}
        onDragOver={isUploadAllowed ? handleDragOver : undefined}
        onDrop={isUploadAllowed ? handleDrop : undefined}
      >
        {inDropZone ? (
          <Icon className={classes.downIcon} iconName={'Down'} />
        ) : (
          <Icon className={classes.attachIcon} iconName={'CloudUpload'} />
        )}
        <span className={textClassName}>{text}</span>
        {!inDropZone && (
          <span>
            <span className={classes.selectFile}>Or</span>
            <Link
              disabled={!isUploadAllowed}
              className={classes.linkItem}
              onClick={() => {
                const input = document.getElementById(FILE_UPLOAD_CONSTANTS.FILE_UPLOAD);
                if (input) {
                  input.click();
                }
              }}
            >
              {browseMsg}
            </Link>
            <form>
              <FileUpload
                id={FILE_UPLOAD_CONSTANTS.FILE_UPLOAD}
                selectedFiles={files}
                fileTypes={props.fileTypes}
                fileParsers={props.fileParsers}
                maxFiles={props.maxFiles}
                onChange={onFileUploadChange}
                onLoad={!props.disableFileRead ? onLoad : undefined}
                style={{ display: 'none' }}
              ></FileUpload>
            </form>
          </span>
        )}
      </div>
    );
  };

  const getFileBrowserLink = () => {
    const browseMessage = props.browseMessage || FILE_UPLOAD_CONSTANTS.BROWSE_MSG;
    const isUploadAllowed = !props.disableFileSelection && files.length < (props.maxFiles || 1);
    return (
      <>
        <Link
          disabled={!isUploadAllowed}
          className={mergeClassNames([classes.browseLink, props.browseLinkClass])}
          onClick={() => {
            const input = document.getElementById(FILE_UPLOAD_CONSTANTS.FILE_UPLOAD);
            if (input) {
              if (input) {
                input.click();
              }
            }
          }}
        >
          {browseMessage}
        </Link>
        <form>
          <FileUpload
            id={FILE_UPLOAD_CONSTANTS.FILE_UPLOAD}
            selectedFiles={files}
            fileTypes={props.fileTypes}
            fileParsers={props.fileParsers}
            maxFiles={props.maxFiles}
            onChange={onFileUploadChange}
            onLoad={!props.disableFileRead ? onLoad : undefined}
            style={{ display: 'none' }}
          ></FileUpload>
        </form>
      </>
    );
  };

  const getFileUploadList = () => {
    return FileUploadListComponent
      ? files.length > 0 && (
          <FileUploadListComponent
            selectedFiles={files}
            fileUploadListHeight={props.fileUploadListHeight}
            hideFileUploadStatus={props.hideFileUploadStatusColumn}
            onRemove={props.disableFileRemove ? undefined : onRemoveFile}
            onDownLoad={props.onDownload}
            onRenderFileNameColumn={props.onRenderFileNameColumn}
            fileListContainerClass={props.fileListContainerClass}
          />
        )
      : files.length > 0 && (
          <FileUploadList
            selectedFiles={files}
            fileUploadListHeight={props.fileUploadListHeight}
            hideFileUploadStatus={props.hideFileUploadStatusColumn}
            onRemove={props.disableFileRemove ? undefined : onRemoveFile}
            onDownLoad={props.onDownload}
            onRenderFileNameColumn={props.onRenderFileNameColumn}
            fileListContainerClass={props.fileListContainerClass}
          ></FileUploadList>
        );
  };

  return (
    <div className={mergeClassNames([classes.fileUploader, props.className])}>
      {!props.hideFileUpload && (
        <>
          {(props.uploaderType === undefined || props.uploaderType === FileUploaderType.DropZone) &&
            getfileDropZone()}
          {props.uploaderType === FileUploaderType.BrowseLink && getFileBrowserLink()}
        </>
      )}
      {!props.hideFileUploadList && getFileUploadList()}
      {props.children}
    </div>
  );
};
