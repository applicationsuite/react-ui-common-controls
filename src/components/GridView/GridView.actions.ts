import {
  IGridViewParams,
  IGridViewCallbacks,
  IPagingOptions,
  ISortingOptions,
  IGridColumn,
  IGridFilter
} from './GridView.models';

export const GRIDVIEW_ACTIONS = {
  INITIALIZE: 'initialize',
  SET_ITEMS: 'setItems',
  SET_COLUMNS: 'setColumns',
  SET_GROUP_COLUMN: 'setGroupColumn',
  SET_SEARCH_TEXT: 'setSearchText',
  SET_FILTER_ITEMS: 'setFilterItems',
  SET_PAGING_OPTIONS: 'setPagingOptions',
  SET_PAGINATED_FILTERED_ITEMS: 'setPaginatedFilteredItems',
  SET_SORT_OPTIONS: 'setSortOptions',
  SET_SELECTED_ITEMS: 'setSelectedItems',
  SET_FILTERS: 'setFilters',
  SET_FILTERS_TO_APPLY: 'setFiltersToApply',
  SET_FILTER_TO_APPLY: 'setFilterToApply',
  SET_SELECTED_FILTERS: 'setSelectedFilters',
  SET_GROUPS: 'setGroups',
  SET_DATA: 'setData'
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
}
