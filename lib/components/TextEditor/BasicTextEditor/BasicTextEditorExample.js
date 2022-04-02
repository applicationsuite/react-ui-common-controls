import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BasicTextEditor } from './BasicTextEditor';
import { ContentType, TextAlignment } from './BasicTextEditor.models';
export const BasicTextEditorExample = () => {
    const [value, setValue] = React.useState('');
    const onChange = (formattedValue, unFormattedValue) => {
        console.log(formattedValue);
        console.log(unFormattedValue);
    };
    const renderActionButtons = () => {
        return (_jsxs(_Fragment, { children: [_jsx("button", { children: "B" }, void 0), _jsx("button", { children: "I" }, void 0)] }, void 0));
    };
    return (_jsx(BasicTextEditor, { contentType: ContentType.Html, value: '', onChange: onChange, textAlignment: TextAlignment.Left }, void 0));
};
