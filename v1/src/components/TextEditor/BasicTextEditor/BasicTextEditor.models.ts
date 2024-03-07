export const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' }
];

export const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' }
];

export interface IBasicTextEditorProps {
  contentType: ContentType;
  onChange: (value: string, nonFormattedValue?: string) => void;
  value?: string;
  containerClassName?: string;
  className?: string;
  placeholder?: string;
  textAlignment?: TextAlignment;
  readOnly?: boolean;
  disableSpellCheck?: boolean;
  ariaLabel?: string;
  renderActionButtons?: () => any;
}

export enum ContentType {
  Json = 1,
  Html = 2
}

export enum TextAlignment {
  Left = 'left',
  Right = 'right',
  Center = 'center'
}
