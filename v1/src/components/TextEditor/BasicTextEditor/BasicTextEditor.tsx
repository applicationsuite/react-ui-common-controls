import React from 'react';
import { createUseStyles } from 'react-jss';
import {
  Editor,
  EditorState,
  RichUtils,
  DraftEditorCommand,
  getDefaultKeyBinding,
  ContentBlock,
  ContentState,
  convertToRaw,
  convertFromHTML,
  convertFromRaw
} from 'draft-js';
import {
  IBasicTextEditorProps,
  BLOCK_TYPES,
  INLINE_STYLES,
  ContentType
} from './BasicTextEditor.models';
import { stateToHTML } from 'draft-js-export-html';
import { mergeClassNames } from '../../../utilities/mergeClassNames';
import 'draft-js/dist/Draft.css';
import { basicTextEditorStyles } from './BasicTextEditor.styles';

const useStyles = createUseStyles(basicTextEditorStyles);

export const BasicTextEditor: React.FC<IBasicTextEditorProps> = (props) => {
  const classes = useStyles();
  const [editorState, setEditorState] = React.useState<EditorState>(EditorState.createEmpty());

  React.useEffect(() => {
    let currentState = getInitialState(props.value, props.contentType);
    setEditorState(
      currentState ? EditorState.createWithContent(currentState) : EditorState.createEmpty()
    );
  }, []);

  const editorRef = React.createRef();

  const onChange = (state: EditorState) => {
    const content = state.getCurrentContent();
    const formmatedData = getFormattedData(content, props.contentType);
    setEditorState(state);
    props.onChange && props.onChange(formmatedData, content.getPlainText());
  };

  const getInitialState = (value: any, contentType: ContentType) => {
    try {
      let currentState: ContentState;
      if (contentType === ContentType.Html) {
        const blocksFromHTML = convertFromHTML(value);
        currentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
      } else if (contentType === ContentType.Json) {
        currentState = convertFromRaw(JSON.parse(value));
      } else {
        currentState = ContentState.createFromText(value);
      }
      return currentState;
    } catch (e: any) {
      return undefined;
    }
  };

  const getFormattedData = (currentState: ContentState, contentType: ContentType) => {
    try {
      const rawContent = convertToRaw(currentState);
      let formattedContent = '';
      if (contentType === ContentType.Html) {
        formattedContent = stateToHTML(currentState);
      } else if (contentType === ContentType.Json) {
        formattedContent = JSON.stringify(rawContent);
      } else {
        formattedContent = currentState.getPlainText();
      }
      return formattedContent;
    } catch (e: any) {
      return '';
    }
  };

  const handleKeyCommand = (
    command: DraftEditorCommand,
    state: EditorState,
    eventTimeStamp: number
  ) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e: any) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        onChange(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType: string) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const getBlockStyleControls = () => {
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className={classes.basicEditorControls}>
        {BLOCK_TYPES.map((type) =>
          getStyleButton(
            type.label,
            type.style === blockType,
            type.label,
            type.style,
            toggleBlockType
          )
        )}
      </div>
    );
  };

  const getInlineStyleControls = () => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
      <div className={classes.basicEditorControls}>
        {INLINE_STYLES.map((type) =>
          getStyleButton(
            type.label,
            currentStyle.has(type.style),
            type.label,
            type.style,
            toggleInlineStyle
          )
        )}
      </div>
    );
  };

  const getStyleButton = (
    key: string,
    active: boolean,
    label: string,
    style: string,
    onToggle: (style: string) => void
  ) => {
    const onMouseDown = (e: any) => {
      e.preventDefault();
      onToggle(style);
    };

    const onKeyDown = (e: any) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        onToggle(style);
      }
    };

    return (
      <span
        key={key}
        tabIndex={0}
        role={'button'}
        aria-label={label}
        className={mergeClassNames([
          classes.basicEditorButtons,
          active ? classes.basicEditorButtonsActive : ''
        ])}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
      >
        {label}
      </span>
    );
  };

  const getBlockStyle = (block: ContentBlock) => {
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

  const setEditFocus = () => {};

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

  return (
    <div
      className={
        props.containerClassName
          ? mergeClassNames([classes.basicEditorRoot, props.containerClassName])
          : classes.basicEditorRoot
      }
    >
      {props.renderActionButtons ? (
        props.renderActionButtons()
      ) : (
        <>
          {getBlockStyleControls()}
          {getInlineStyleControls()}
        </>
      )}

      <div
        className={props.className ? mergeClassNames([className, props.className]) : className}
        onClick={setEditFocus}
      >
        <Editor
          blockStyleFn={getBlockStyle}
          //customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={onChange}
          placeholder={props.placeholder}
          //ref={editorRef}
          spellCheck={!props.disableSpellCheck}
          textAlignment={props.textAlignment}
          readOnly={props.readOnly}
          ariaLabel={props.ariaLabel}
          preserveSelectionOnBlur={true}
        />
      </div>
    </div>
  );
};
