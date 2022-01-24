export declare const parseExcelFileToJSON: (fileContent: any, columns?: any[], isMultiSheet?: boolean, trimWhitespace?: boolean, isColumnNameCheck?: boolean, parseRawValues?: boolean) => Promise<unknown>;
export declare const parseExcelFileToJSONUsingColumnOrder: (fileContent: any, columns?: any[], isMultiSheet?: boolean, hasColumnHeader?: boolean) => Promise<unknown>;
