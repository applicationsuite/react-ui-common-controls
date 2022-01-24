var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useImperativeHandle } from 'react';
import { loadFiles, getUpdatedFiles } from './fileUploadUtils';
export const FileUpload = (props) => {
    useImperativeHandle(props.triggerFileLoadRef, () => triggerFileLoad, []);
    const onChange = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        let files = getUpdatedFiles(e.target.files, props.fileTypes, props.maxFileSize, props.selectedFiles);
        const maxFiles = props.maxFiles || 1;
        if (files.length > maxFiles) {
            files.splice(maxFiles, files.length);
        }
        if (!(files && files.length > 0)) {
            return;
        }
        props.onChange && props.onChange(files, e);
        //Any Custom validation
        if (props.onValidate && !props.onValidate(files)) {
            return;
        }
        if (!props.onLoad) {
            return;
        }
        if (props.triggerFileLoadRef) {
            return;
        }
        const filesContent = yield loadFiles(files, props.fileParsers);
        props.onLoad(filesContent);
    });
    const triggerFileLoad = (files) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(files && files.length > 0)) {
            return;
        }
        if (!props.onLoad) {
            return;
        }
        const filesContent = yield loadFiles(files, props.fileParsers);
        props.onLoad(filesContent);
    });
    const getFileExtensions = () => {
        if (props.fileTypes && props.fileTypes.length) {
            return props.fileTypes.join(',');
        }
        else {
            return '';
        }
    };
    const fileUploadClick = (e) => {
        e.target.value = null;
    };
    return (_jsx(_Fragment, { children: _jsx("input", { id: props.id, type: "file", name: props.name, ref: props.ref, style: props.style, "aria-label": props.ariaLabel, multiple: (props.maxFiles || 1) > 1, accept: getFileExtensions(), onChange: onChange, onClick: fileUploadClick, className: props.className }, void 0) }, void 0));
};
