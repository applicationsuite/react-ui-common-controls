export declare const BLOCK_TYPES: {
    label: string;
    style: string;
}[];
export declare const INLINE_STYLES: {
    label: string;
    style: string;
}[];
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
export declare enum ContentType {
    Json = 1,
    Html = 2
}
export declare enum TextAlignment {
    Left = "left",
    Right = "right",
    Center = "center"
}
