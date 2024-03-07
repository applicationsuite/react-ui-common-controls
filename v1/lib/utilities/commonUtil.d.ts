export declare const applyPaging: (pageSize: number | undefined, pageNumber: number | undefined, items: any[]) => any[];
export declare const applyFilterText: (items: any[], fieldName: string, value?: string | undefined) => any[];
export declare const applyFilters: (filters: any[] | undefined, items: any[], fieldName: string) => any[];
export declare const applySorting: (items: any[], sortColumn: string, sortType: string) => any[];
export declare const sortValues: (val1: any, val2: any, sortType: string) => 0 | 1 | -1;
