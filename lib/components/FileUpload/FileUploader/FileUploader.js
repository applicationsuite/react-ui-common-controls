var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { FileUpload, FileUploaderType, FILE_UPLOAD_CONSTANTS, FileUploadState } from '..';
import { mergeClassNames } from '../../../utilities/mergeClassNames';
import { fileUploaderStyles } from './FileUploader.styles';
import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { FileUploadList } from './FileUploadList';
import { getUpdatedFiles, loadFiles } from '../fileUploadUtils';
const useStyles = createUseStyles(fileUploaderStyles);
export const FileUploader = (props) => {
    const { FileUploadListComponent } = props;
    const classes = useStyles();
    const [files, setFiles] = useState(props.selectedFiles || []);
    const [inDropZone, setInDropZone] = React.useState(false);
    React.useEffect(() => {
        let updatedFiles = getUpdatedFiles(props.selectedFiles || []);
        setFiles(updatedFiles);
    }, [props.selectedFiles]);
    const onFileUploadChange = (fileList) => {
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
    const onLoad = (fileList) => {
        const updatedFileList = files.concat(fileList);
        setFiles(updatedFileList || []);
        props.onChange && props.onChange(updatedFileList);
    };
    const onRemoveFile = (file) => {
        const filterFiles = files.filter((item) => item.id !== file.id);
        setFiles(filterFiles || []);
        props.onChange && props.onChange(filterFiles);
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setInDropZone(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setInDropZone(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setInDropZone(true);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const fileList = e.dataTransfer.files;
        loadDroppedFiles(fileList);
        setInDropZone(false);
    };
    const loadDroppedFiles = (list) => __awaiter(void 0, void 0, void 0, function* () {
        const array = [];
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
        const filesContent = yield loadFiles(fileData, props.fileParsers);
        filesContent.forEach((file) => {
            let index = updatedFileList.findIndex((item) => item.id === file.id);
            updatedFileList[index] = file;
        });
        setFiles(updatedFileList);
        props.onChange && props.onChange(updatedFileList);
    });
    const getfileDropZone = () => {
        const dropZoneClass = inDropZone ? classes.fileDropZoneActive : classes.fileDropZone;
        const textClassName = inDropZone ? classes.initialTextActive : classes.initialText;
        const browseMsg = props.browseMessage || FILE_UPLOAD_CONSTANTS.BROWSE_YOUR_FILES;
        const text = inDropZone
            ? FILE_UPLOAD_CONSTANTS.DROP_HERE_FILE_TO_UPLOAD
            : props.fileDropMessage || FILE_UPLOAD_CONSTANTS.DROP_MSG;
        const isUploadAllowed = !props.disableFileSelection && files.length < (props.maxFiles || 1);
        return (_jsxs("div", Object.assign({ className: mergeClassNames([dropZoneClass, props.fileDropZoneContainerClass]), onDragEnter: isUploadAllowed ? handleDragEnter : undefined, onDragLeave: isUploadAllowed ? handleDragLeave : undefined, onDragOver: isUploadAllowed ? handleDragOver : undefined, onDrop: isUploadAllowed ? handleDrop : undefined }, { children: [inDropZone ? (_jsx(Icon, { className: classes.downIcon, iconName: 'Down' }, void 0)) : (_jsx(Icon, { className: classes.attachIcon, iconName: 'CloudUpload' }, void 0)), _jsx("span", Object.assign({ className: textClassName }, { children: text }), void 0), !inDropZone && (_jsxs("span", { children: [_jsx("span", Object.assign({ className: classes.selectFile }, { children: "Or" }), void 0), _jsx(Link, Object.assign({ disabled: !isUploadAllowed, className: classes.linkItem, onClick: () => {
                                const input = document.getElementById(FILE_UPLOAD_CONSTANTS.FILE_UPLOAD);
                                if (input) {
                                    input.click();
                                }
                            } }, { children: browseMsg }), void 0), _jsx("form", { children: _jsx(FileUpload, { id: FILE_UPLOAD_CONSTANTS.FILE_UPLOAD, selectedFiles: files, fileTypes: props.fileTypes, fileParsers: props.fileParsers, maxFiles: props.maxFiles, onChange: onFileUploadChange, onLoad: !props.disableFileRead ? onLoad : undefined, style: { display: 'none' } }, void 0) }, void 0)] }, void 0))] }), void 0));
    };
    const getFileBrowserLink = () => {
        const browseMessage = props.browseMessage || FILE_UPLOAD_CONSTANTS.BROWSE_MSG;
        const isUploadAllowed = !props.disableFileSelection && files.length < (props.maxFiles || 1);
        return (_jsxs(_Fragment, { children: [_jsx(Link, Object.assign({ disabled: !isUploadAllowed, className: mergeClassNames([classes.browseLink, props.browseLinkClass]), onClick: () => {
                        const input = document.getElementById(FILE_UPLOAD_CONSTANTS.FILE_UPLOAD);
                        if (input) {
                            if (input) {
                                input.click();
                            }
                        }
                    } }, { children: browseMessage }), void 0), _jsx("form", { children: _jsx(FileUpload, { id: FILE_UPLOAD_CONSTANTS.FILE_UPLOAD, selectedFiles: files, fileTypes: props.fileTypes, fileParsers: props.fileParsers, maxFiles: props.maxFiles, onChange: onFileUploadChange, onLoad: !props.disableFileRead ? onLoad : undefined, style: { display: 'none' } }, void 0) }, void 0)] }, void 0));
    };
    const getFileUploadList = () => {
        return FileUploadListComponent
            ? files.length > 0 && (_jsx(FileUploadListComponent, { selectedFiles: files, fileUploadListHeight: props.fileUploadListHeight, hideFileUploadStatus: props.hideFileUploadStatusColumn, onRemove: props.disableFileRemove ? undefined : onRemoveFile, onDownLoad: props.onDownload, onRenderFileNameColumn: props.onRenderFileNameColumn, fileListContainerClass: props.fileListContainerClass }, void 0))
            : files.length > 0 && (_jsx(FileUploadList, { selectedFiles: files, fileUploadListHeight: props.fileUploadListHeight, hideFileUploadStatus: props.hideFileUploadStatusColumn, onRemove: props.disableFileRemove ? undefined : onRemoveFile, onDownLoad: props.onDownload, onRenderFileNameColumn: props.onRenderFileNameColumn, fileListContainerClass: props.fileListContainerClass }, void 0));
    };
    return (_jsxs("div", Object.assign({ className: mergeClassNames([classes.fileUploader, props.className]) }, { children: [!props.hideFileUpload && (_jsxs(_Fragment, { children: [(props.uploaderType === undefined || props.uploaderType === FileUploaderType.DropZone) &&
                        getfileDropZone(), props.uploaderType === FileUploaderType.BrowseLink && getFileBrowserLink()] }, void 0)), !props.hideFileUploadList && getFileUploadList(), props.children] }), void 0));
};
