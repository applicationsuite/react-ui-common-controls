import { IObjectWithKey, Selection } from '@fluentui/react';
import { IGridViewActions } from './GridView.actions';
import { IGridViewData, IGridFilter, IGridViewParams, IGridViewCallbacks } from './GridView.models';
export declare const useInit: (props: IGridViewParams, callbacks: IGridViewCallbacks) => {
    state: IGridViewData;
    actions: IGridViewActions;
};
export declare const useSelection: (handleSelectionChange: (selection: Selection<IObjectWithKey>) => void, items: any[], itemUniqueField: string) => Selection<any>;
export declare const getUpdateFilters: (gridFilters: IGridFilter[], selectedFilters: IGridFilter[], items: any[], oldItems?: any[] | undefined, isInMemory?: boolean) => IGridFilter[];
