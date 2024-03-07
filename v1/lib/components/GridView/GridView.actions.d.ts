import { IGridViewParams, IGridViewCallbacks, IPagingOptions, ISortingOptions, IGridColumn, IGridFilter } from './GridView.models';
export declare const GRIDVIEW_ACTIONS: {
    INITIALIZE: string;
    SET_ITEMS: string;
    SET_COLUMNS: string;
    SET_GROUP_COLUMN: string;
    SET_SEARCH_TEXT: string;
    SET_FILTER_ITEMS: string;
    SET_PAGING_OPTIONS: string;
    SET_PAGINATED_FILTERED_ITEMS: string;
    SET_SORT_OPTIONS: string;
    SET_SELECTED_ITEMS: string;
    SET_FILTERS: string;
    SET_FILTERS_TO_APPLY: string;
    SET_FILTER_TO_APPLY: string;
    SET_SELECTED_FILTERS: string;
    SET_GROUPS: string;
    SET_DATA: string;
};
export interface IGridViewActions {
    initialize: (props: IGridViewParams, callbacks: IGridViewCallbacks) => void;
    applyPaging: (items: any[], pagingOptions: IPagingOptions) => void;
    applySorting: (items: any[], sortingOptions: ISortingOptions[], columns: IGridColumn[]) => void;
    applyFilters: (items: any[], selectedFilters: IGridFilter[]) => void;
    applyFilterText: (items: any[], filterText: string) => void;
    applySelectedItems: (selectedItems: any[]) => void;
    applySelectedColumns: (selectedColumns: IGridColumn[]) => void;
    applyGrouping: (column?: IGridColumn) => void;
    setData: (data: any) => void;
    addRecord: () => void;
    editRecords: (items: any[]) => void;
    deleteRecords: (items: any[]) => boolean;
    changeRecords: (items: any[]) => void;
    saveRecords: (items: any[]) => boolean;
    cancelRecords: (items: any[]) => void;
}
