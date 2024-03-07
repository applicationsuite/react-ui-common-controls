import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { FileUploadError, FILE_UPLOAD_ERRORS, FileUploadState } from '../FileUpload.models';
import { fileUploaderStyles } from './FileUploader.styles';
import { DetailsList } from '@fluentui/react/lib/DetailsList';
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
import { Link } from '@fluentui/react/lib/Link';
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
import { mergeClassNames } from '../../../utilities/mergeClassNames';
const useStyles = createUseStyles(fileUploaderStyles);
export const FileUploadList = (props) => {
    const classes = useStyles();
    const getColumns = () => {
        let columns = [
            {
                key: '2',
                name: 'Document Name',
                fieldName: 'DocumentName',
                minWidth: 350,
                maxWidth: 350,
                isResizable: true,
                isRowHeader: true,
                onRender: (item) => {
                    if (props.onRenderFileNameColumn) {
                        return props.onRenderFileNameColumn(item);
                    }
                    return props.onDownLoad ? (_jsxs(_Fragment, { children: [_jsx(Icon, { iconName: "Page" }, void 0), _jsx(Link, Object.assign({ onClick: () => {
                                    props.onDownLoad && props.onDownLoad(item);
                                }, className: classes.gridfileRowContainer }, { children: item.name }), void 0)] }, void 0)) : (_jsxs("span", { children: [_jsx(Icon, { iconName: "Page" }, void 0), " ", item.name] }, void 0));
                }
            }
        ];
        if (!props.hideFileUploadStatus) {
            columns.push({
                key: '3',
                name: 'Status',
                fieldName: 'Status',
                minWidth: 200,
                maxWidth: 200,
                isResizable: true,
                isRowHeader: true,
                onRender: (item) => {
                    return (_jsx(_Fragment, { children: item.uploadState === FileUploadState.InProgress ? (_jsx("div", Object.assign({ className: classes.progressIndicator }, { children: item.uploadState === FileUploadState.InProgress && _jsx(ProgressIndicator, {}, void 0) }), void 0)) : (_jsxs(_Fragment, { children: [item.uploadError !== FileUploadError.None && (_jsxs("div", Object.assign({ className: classes.gridfileRowContainer }, { children: [_jsx(Icon, { className: classes.errorIcon, iconName: "Error", title: "Error" }, void 0), _jsx("span", Object.assign({ className: classes.errorText }, { children: FILE_UPLOAD_ERRORS[item.uploadError] }), void 0)] }), void 0)), item.uploadState === FileUploadState.Complete && (_jsx("div", Object.assign({ className: classes.gridfileRowContainer }, { children: _jsx(Icon, { className: classes.successIcon, iconName: "Completed", title: "Completed" }, void 0) }), void 0))] }, void 0)) }, void 0));
                }
            });
        }
        if (props.onRemove) {
            columns.push({
                key: '4',
                name: 'Action',
                fieldName: 'Delete',
                minWidth: 35,
                maxWidth: 35,
                isResizable: true,
                isRowHeader: true,
                onRender: (item) => {
                    return (_jsx(IconButton, { ariaLabel: "Delete", iconProps: { iconName: 'Delete' }, onClick: () => props.onRemove && props.onRemove(item) }, void 0));
                }
            });
        }
        return columns;
    };
    return (_jsx("div", Object.assign({ className: mergeClassNames([classes.fileListContainer, props.fileListContainerClass]) }, { children: _jsx(DetailsList, { className: mergeClassNames([classes.fileListGrid, props.fileListGridClass]), columns: getColumns(), items: props.selectedFiles }, void 0) }), void 0));
};
