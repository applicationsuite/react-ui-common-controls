import { Selection } from '@fluentui/react/lib/DetailsList';
import { IGridViewActions } from './GridView.actions';
import { IGridViewData, ISortingOptions, IGridFilter, IGridViewParams, IGridColumn, IGridViewCallbacks } from './GridView.models';
export declare const useInit: (props: IGridViewParams, callbacks: IGridViewCallbacks) => {
    state: IGridViewData;
    actions: IGridViewActions;
    selection: Selection<any>;
};
export declare const useSelection: (props: IGridViewParams, handleSelectionChange: any, state: IGridViewData) => Selection<any>;
export declare const getUpdateFilters: (gridFilters: IGridFilter[], selectedFilters: IGridFilter[], items: any[], oldItems?: any[] | undefined, isInMemory?: boolean) => IGridFilter[];
export declare const updateColumns: (newColumns: IGridColumn[], existingColumns: IGridColumn[], sortingOptions: ISortingOptions, onColumnSort: any, removeSorting?: boolean | undefined, isActionColumnRequired?: boolean | undefined) => IGridColumn[];
export declare const getFilteredSelectedItems: (items: any[], selectedItems: any[], itemUniqueField: string) => any[];
