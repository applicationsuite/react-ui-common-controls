import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { FileUploader, FILE_EXTENSIONS, FileUploaderType, FileUploadState } from '..';
import { parseExcelFileToJSON } from '../fileParsers';
import { ProgressIndicator } from '@fluentui/react';
export const FileUploaderExample = () => {
    const [files, setFiles] = React.useState();
    const parsers = {
        [FILE_EXTENSIONS.XLSX]: (fileContent) => {
            return parseExcelFileToJSON(fileContent);
        },
        [FILE_EXTENSIONS.CSV]: (fileContent) => {
            return parseExcelFileToJSON(fileContent);
        },
        [FILE_EXTENSIONS.XLS]: (fileContent) => {
            return parseExcelFileToJSON(fileContent, [{ Name: 'Name' }, { Age: 'Age' }]);
        }
    };
    const onChange = (files) => {
        setFiles(files);
        console.log(files);
    };
    const onDownload = (files) => {
        console.log(files);
    };
    const onRenderFileNameColumn = (item) => {
        return (_jsxs(_Fragment, { children: [_jsx("span", { children: item.name }, void 0), item.uploadState === FileUploadState.InProgress && _jsx(ProgressIndicator, {}, void 0)] }, void 0));
    };
    return (_jsx(_Fragment, { children: _jsx(FileUploader, { uploaderType: FileUploaderType.DropZone, maxFiles: 10, fileTypes: [FILE_EXTENSIONS.CSV, FILE_EXTENSIONS.XLS, FILE_EXTENSIONS.XLSX], onChange: onChange, onDownload: onDownload, fileUploadListHeight: 500 }, void 0) }, void 0));
};
