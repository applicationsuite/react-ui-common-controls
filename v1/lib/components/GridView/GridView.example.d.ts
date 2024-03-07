/// <reference types="react" />
export interface IDocument {
    id: number;
    name: string;
    fileType: string;
    dateModified: Date;
    isValid: boolean;
    fileSize: string;
}
export declare const tempStyles: () => {
    actionMenu: {};
    gridSection: {};
    gridDataClass: {};
};
export declare const GridViewExample: () => JSX.Element;
