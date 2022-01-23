import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
export const GridViewDefault = (props) => {
    const getColumns = (columns) => props.hideColumnPicker
        ? props.columns
        : columns && columns.filter((column) => column.selected === true);
    return _jsx(_Fragment, {}, void 0);
};
