import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { FileUpload, FILE_EXTENSIONS } from '.';
import { parseExcelFileToJSON } from './fileParsers';
export const FileUploadExample = () => {
    const [files, setFiles] = React.useState();
    const triggerFileLoadRef = React.createRef();
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
    const onChange = (files, e) => {
        setFiles(files);
        console.log(files);
    };
    const onValidate = (files) => {
        return true;
    };
    const onLoad = (files) => {
        console.log(files);
    };
    const onUploadClick = () => {
        triggerFileLoadRef.current(files);
        setFiles(undefined);
    };
    return (_jsx(_Fragment, { children: _jsx(FileUpload, { maxFiles: 1, fileTypes: [FILE_EXTENSIONS.CSV, FILE_EXTENSIONS.XLS, FILE_EXTENSIONS.XLSX], fileParsers: parsers, onChange: onChange, onValidate: onValidate, onLoad: onLoad }, void 0) }, void 0));
};
