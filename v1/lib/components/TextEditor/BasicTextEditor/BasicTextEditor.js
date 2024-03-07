import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, ContentState, convertToRaw, convertFromHTML, convertFromRaw } from 'draft-js';
import { BLOCK_TYPES, INLINE_STYLES, ContentType } from './BasicTextEditor.models';
import { stateToHTML } from 'draft-js-export-html';
import { mergeClassNames } from '../../../utilities/mergeClassNames';
import 'draft-js/dist/Draft.css';
import { basicTextEditorStyles } from './BasicTextEditor.styles';
const useStyles = createUseStyles(basicTextEditorStyles);
export const BasicTextEditor = (props) => {
    const classes = useStyles();
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
    React.useEffect(() => {
        let currentState = getInitialState(props.value, props.contentType);
        setEditorState(currentState ? EditorState.createWithContent(currentState) : EditorState.createEmpty());
    }, []);
    const editorRef = React.createRef();
    const onChange = (state) => {
        const content = state.getCurrentContent();
        const formmatedData = getFormattedData(content, props.contentType);
        setEditorState(state);
        props.onChange && props.onChange(formmatedData, content.getPlainText());
    };
    const getInitialState = (value, contentType) => {
        try {
            let currentState;
            if (contentType === ContentType.Html) {
                const blocksFromHTML = convertFromHTML(value);
                currentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            }
            else if (contentType === ContentType.Json) {
                currentState = convertFromRaw(JSON.parse(value));
            }
            else {
                currentState = ContentState.createFromText(value);
            }
            return currentState;
        }
        catch (e) {
            return undefined;
        }
    };
    const getFormattedData = (currentState, contentType) => {
        try {
            const rawContent = convertToRaw(currentState);
            let formattedContent = '';
            if (contentType === ContentType.Html) {
                formattedContent = stateToHTML(currentState);
            }
            else if (contentType === ContentType.Json) {
                formattedContent = JSON.stringify(rawContent);
            }
            else {
                formattedContent = currentState.getPlainText();
            }
            return formattedContent;
        }
        catch (e) {
            return '';
        }
    };
    const handleKeyCommand = (command, state, eventTimeStamp) => {
        const newState = RichUtils.handleKeyCommand(state, command);
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };
    const mapKeyToEditorCommand = (e) => {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
            if (newEditorState !== editorState) {
                onChange(newEditorState);
            }
            return null;
        }
        return getDefaultKeyBinding(e);
    };
    const toggleBlockType = (blockType) => {
        onChange(RichUtils.toggleBlockType(editorState, blockType));
    };
    const toggleInlineStyle = (inlineStyle) => {
        onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    const getBlockStyleControls = () => {
        const selection = editorState.getSelection();
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();
        return (_jsx("div", Object.assign({ className: classes.basicEditorControls }, { children: BLOCK_TYPES.map((type) => getStyleButton(type.label, type.style === blockType, type.label, type.style, toggleBlockType)) }), void 0));
    };
    const getInlineStyleControls = () => {
        const currentStyle = editorState.getCurrentInlineStyle();
        return (_jsx("div", Object.assign({ className: classes.basicEditorControls }, { children: INLINE_STYLES.map((type) => getStyleButton(type.label, currentStyle.has(type.style), type.label, type.style, toggleInlineStyle)) }), void 0));
    };
    const getStyleButton = (key, active, label, style, onToggle) => {
        const onMouseDown = (e) => {
            e.preventDefault();
            onToggle(style);
        };
        const onKeyDown = (e) => {
            if (e.keyCode === 13) {
                e.preventDefault();
                onToggle(style);
            }
        };
        return (_jsx("span", Object.assign({ tabIndex: 0, role: 'button', "aria-label": label, className: mergeClassNames([
                classes.basicEditorButtons,
                active ? classes.basicEditorButtonsActive : ''
            ]), onMouseDown: onMouseDown, onKeyDown: onKeyDown }, { children: label }), key));
    };
    const getBlockStyle = (block) => {
        switch (block.getType()) {
            case 'blockquote':
                return classes.basicEditorBlockQuote;
            default:
                return '';
        }
    };
    const styleMap = {
        CODE: {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
            fontSize: 16,
            padding: 2
        }
    };
    const setEditFocus = () => { };
    const getClassName = () => {
        let className = classes.basicEditor;
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className = mergeClassNames([className, classes.basicEditorHidePlaceHolder]);
            }
        }
        return className;
    };
    const className = getClassName();
    return (_jsxs("div", Object.assign({ className: props.containerClassName
            ? mergeClassNames([classes.basicEditorRoot, props.containerClassName])
            : classes.basicEditorRoot }, { children: [props.renderActionButtons ? (props.renderActionButtons()) : (_jsxs(_Fragment, { children: [getBlockStyleControls(), getInlineStyleControls()] }, void 0)), _jsx("div", Object.assign({ className: props.className ? mergeClassNames([className, props.className]) : className, onClick: setEditFocus }, { children: _jsx(Editor, { blockStyleFn: getBlockStyle, 
                    //customStyleMap={styleMap}
                    editorState: editorState, handleKeyCommand: handleKeyCommand, keyBindingFn: mapKeyToEditorCommand, onChange: onChange, placeholder: props.placeholder, 
                    //ref={editorRef}
                    spellCheck: !props.disableSpellCheck, textAlignment: props.textAlignment, readOnly: props.readOnly, ariaLabel: props.ariaLabel, preserveSelectionOnBlur: true }, void 0) }), void 0)] }), void 0));
};
