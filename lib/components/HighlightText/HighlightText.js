import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { mergeClassNames } from '../../';
import { highlightedTextStyles } from './HighlightedText.styles';
const useStyles = createUseStyles(highlightedTextStyles);
export const HighlightText = (props) => {
    let text = props.text || '';
    let textToBeHighlighted = props.textToBeHighlighted || '';
    const classes = useStyles();
    let parts = [];
    try {
        parts = text.split(new RegExp(`(${textToBeHighlighted})`, 'gi'));
    }
    catch (e) {
        parts = [text];
    }
    return (_jsx(_Fragment, { children: parts.map((part, i) => {
            return (_jsx("span", Object.assign({ className: part.toLowerCase() === textToBeHighlighted.toLowerCase()
                    ? mergeClassNames([classes.highlightedText, props.highLightTextClass])
                    : '' }, { children: part }), i));
        }) }, void 0));
};
