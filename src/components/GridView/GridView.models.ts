import React from 'react';
import { IColumn, IDetailsListProps, IGroup } from '@fluentui/react/lib/DetailsList';
import { IGridViewActions } from './GridView.actions';
import { PageType } from '../Pagination/Pagination.models';

export enum GridViewType {
  InMemory = 0,
  ServerSide = 1
}

export enum FilterType {
  SelectionFilter = 0,
  RangeFilter = 1,
  ToggleFilter = 2,
  TimeLineFilter = 3,
  Custom = 4
}

export enum FilterOperation {
  Equal = 0,
  GreaterThanEqual = 1,
  LessThanEqual = 2,
  Between = 3
}

export enum TimelineFilterType {
  Q1 = 0,
  Q2 = 1,
  Q3 = 2,
  Q4 = 3,
  Custom = 4
}

export enum GridViewActionBarItems {
  Custom = 0,
  RefreshButton = 1,
  ExportButton = 2,
  EditButton = 3,
  DeleteButton = 4,
  GroupColumnsButton = 5,
  ColumnsButton = 6,
  FilterButton = 7,
  SearchBox = 8,
  SortButton = 9,
  SaveButton = 10,
  CancelButton = 11
}

export enum FilterDataType {
  String = 0,
  Number = 1,
  Date = 2,
  Boolean = 3
}

export enum GridViewMessageType {
  Information = 0,
  Success = 1,
  Warning = 2,
  Error = 3,
  SevereWarning = 4,
  Blocked = 5
}

export enum QucickActionSectionAlignment {
  Left = 0,
  Right = 1
}

export enum GridViewChangeType {
  SelectedFilters = 0,
  SearchText = 1,
  Pagination = 2,
  Sorting = 3,
  SelectedItems = 4,
  GroupBy = 5
}

export enum GridViewGroupLabelType {
  GroupValue = 0,
  GroupValueAndCount = 1,
  ColumnNameAndGroupValueAndCount = 2
}

export enum ActionBarSectionType {
  Left = 0,
  Right = 1
}

export enum ControlType {
  TextBox = 0,
  ComboBox = 1,
  DatePicker = 2,
  Custom = 3
}

export enum OperationType {
  Add = 0,
  Edit = 1,
  Delete = 2
}

export const DEFAULT_MESSAGE_DISMISS_TIME = 5000;

export const FILTER_ITEM_TEXT_FIELD = 'label';
export const FILTER_ITEM_VALUE_FIELD = 'value';

export const QUATER_START_MONTH = 6;
export const QUATER_START_YEAR =
  new Date().getMonth() >= QUATER_START_MONTH
    ? new Date().getFullYear()
    : new Date().getFullYear() - 1;

export const OPERATIONS_MAP = {
  [FilterOperation.Equal]: '=',
  [FilterOperation.GreaterThanEqual]: '>=',
  [FilterOperation.LessThanEqual]: '<=',
  [FilterOperation.Between]: ''
};

export const OPERATIONS_STRINGS_MAP = {
  [FilterOperation.Equal]: '',
  [FilterOperation.GreaterThanEqual]: 'Grater than equal To (>=) ',
  [FilterOperation.LessThanEqual]: 'Less than equal to (<=) ',
  [FilterOperation.Between]: 'Between'
};

export const OPERATIONS_DATE_STRINGS_MAP = {
  [FilterOperation.Equal]: '',
  [FilterOperation.GreaterThanEqual]: 'After ',
  [FilterOperation.LessThanEqual]: 'Before ',
  [FilterOperation.Between]: 'Between'
};

export const TIME_LINE_FILTER_TYPE_MAP = {
  [TimelineFilterType.Q1]: 'Q1',
  [TimelineFilterType.Q2]: 'Q2',
  [TimelineFilterType.Q3]: 'Q3',
  [TimelineFilterType.Q4]: 'Q4',
  [TimelineFilterType.Custom]: 'Custom'
};

export const GRIDVIEW_LOCALIZATION_STRINGS = {
  ADD: { id: 'GridView_Add', defaultMessage: 'Add' },
  CONFIRMATION: { id: 'GridView_Confirmation', defaultMessage: 'Confirmation' },
  CONFIRMATION_MESSAGE: {
    id: 'GridView_Confirmation_Message',
    defaultMessage: 'Are you sure to delete?'
  },
  CLEAR_FILTERS: {
    id: 'GridView_ClearFilters',
    defaultMessage: 'Clear Filters'
  },
  SELECT_DATE: {
    id: 'GridView_Select_Date',
    defaultMessage: 'Select a date'
  }
};

export interface IGridViewContextData {
  state: IGridViewData;
  actions: IGridViewActions;
}

export interface IDefaultSelections {
  pagingOptions?: IPagingOptions;
  sortingOptions?: ISortingOptions[];
  selectedFilters?: IGridFilter[];
  searchText?: string;
  selectedItems?: any[];
  groupBy?: string;
}

export interface IGridViewData {
  gridViewType: GridViewType;
  items: any[];
  totalRecords?: number;
  itemUniqueField?: string;
  columns?: IGridColumn[];
  groups?: IGroup[];
  groupColumn?: IGridColumn;
  filteredItems?: any[];
  paginatedFilteredItems?: any[];
  pagingOptions?: IPagingOptions;
  sortingOptions?: ISortingOptions[];
  searchText?: string;
  selectedFilters?: IGridFilter[];
  filters?: IGridFilter[];
  selectedItems?: any[];
  searchFields?: ISearchField[];
  allowSelection?: boolean;
  allowGrouping?: boolean;
  allowGroupSelection?: boolean;
  availableFilters?: IGridFilter[];
  filtersToApply?: IGridFilter[];
  filterToApply?: IGridFilter;
  statusMessages?: IGridViewMessageData[];
  showFilters?: boolean;
  hidePaging?: boolean;
  isUpdateMode?: boolean;
}

export interface IPagingOptionsWithoutPage {
  isNextAllowed: boolean;
  isPreviousAllowed: boolean;
}

export interface IPagingOptions {
  pageSize: number;
  pageNumber: number;
  pageType?: PageType;
}

export interface ISortingOptions {
  sortType: string;
  sortColumn: string;
  sortField: string;
  applySorting?: (items: any[], sortingOptions: ISortingOptions) => any[];
}

export interface IMultiColumnSort {
  isInMemorySorting: boolean;
  columns: IGridColumn[];
  sortingOptions: ISortingOptions[];
  sortLevel?: number;
  onSort?: (sortingOptions: ISortingOptions[]) => void;
  toggleSortButton?: () => void;
}

export interface IGridFilter {
  filterType: FilterType;
  id: string;
  label: string;
  isCollapsible?: boolean;
  isNonRemovable?: boolean;
  hideSelectAll?: boolean;
  dataType?: FilterDataType;
  fieldName: string;
  values?: any[];
  items?: IGridFilterItem[];
  itemsSearchRequired?: boolean;
  operation?: FilterOperation;
  data?: any;
  isCurrent?: boolean;
  populateItems?: boolean;
  order?: number;
  FilterComponent?: any;
  // renderFilter?: (filter: IGridFilter, items?: any[]) => any;
  applyFilter?: (filter: IGridFilter, items: any[]) => any[];
}

export interface IGridFilterItem {
  label: string;
  value: any;
  selected?: boolean;
  count?: number;
  onRenderLabel?: (props: any) => any; //For Selection Filter
}

export interface ISearchField {
  fieldName: string;
  label: string;
  applySearchText?: (filterText: string, items: any[]) => any[];
}

export interface IGridViewParams extends IDetailsListProps {
  gridViewType: GridViewType;

  // Required Data
  items: any[]; // items for gridview
  totalRecords?: number; // this is required when its not in-memory
  columns: IGridColumn[]; // columns for the gridview

  // Show/hide Sections or Features
  allowMultiLevelSorting?: boolean; // Allows multi level sorting. When this is enabled individual column header sorting is removed
  sortLevel?: number; //number of columns part of multi sort
  removeSorting?: boolean; // disable sorting
  allowSelection?: boolean; // enable selection
  allowGrouping?: boolean; // enable gouping
  allowGroupSelection?: boolean; // to select group field, applicable when more than one field grouping is required
  isLoading?: boolean;
  quickSearchOnEnter?: boolean; // this enables quick search on enter behavior
  hideQuickSearch?: boolean; // hide the quick search text box
  hideQuickSearchButton?: boolean; // hide the quick search button for the quick search text box
  hideQuickActionSection?: boolean; // hide the complete quick section section which contains filters, column selection and quick search
  hideColumnPicker?: boolean; // hides the column picker
  hidePaging?: boolean; // hides paging and is required when no paging is required.
  hideFilters?: boolean; // hide the filters
  hideGridSummary?: boolean; // hide the items count and selection count message.
  highLightSearchText?: boolean; //highlights the quick search text
  hideClearFilters?: boolean; //hides the clear filters button in the filter tags
  selectFirstItemOnLoad?: boolean; //select first item on load
  showFiltersAside?: boolean;
  showFiltersOnLoad?: boolean;
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  hideInlineEdit?: boolean;
  hideInlineDelete?: boolean;
  hideBulkEdit?: boolean;
  hideBulkDelete?: boolean;

  // Selections
  pagingOptions?: IPagingOptions; // paging options for the gridview
  pagingOptionsWithoutPage?: IPagingOptionsWithoutPage; // use this when page number and total records are unknown.
  sortingOptions?: ISortingOptions[]; // sorting options for the gridview
  selectedFilters?: IGridFilter[]; // filter options for the gridview
  selectedItems?: any[]; // selected items to enable default selection. To enable default selection you need to pass the itemUniqueField.
  searchText?: string; // Search Text value which needs to be shown in quick search text box
  groupBy?: string; //Default group by column

  // Other Data
  groups?: IGroup[]; // This field is only required if you want custom grouping. Most of the grouping feature is part of columns so please make use of that.
  itemUniqueField?: string; // This is the name of the field which is unique in the item collection. It must be passed when quick search or selection is required
  searchPlaceHolderText?: string; // place holder text for the quick search text box.
  searchFields?: ISearchField[]; // this represents what item fields upon which quick search will be applied. You need to pass the itemUniqueField when u pass more than one field.
  filters?: IGridFilter[]; // This you need when you need custom filters.  Most of the filter features are part of columns so please make use of that.
  statusMessages?: IGridViewMessage[]; // To Show status message in the gridview
  maxSelection?: Number; // if you want a limit on maximum number of item selection
  maxFilterTagLength?: number; // max length of visible filter tag values
  exportOptions?: IExportOptions[]; // export options is for export functionality
  quickActionSectionItems?: IQucickActionSectionItem[]; // this is to customize the action bar items like filters, quick search
  QuickActionSectionComponent?: any;
  FilterTagsComponent?: any;
  GridSummaryComponent?: any;
  StatusMessageSectionComponent?: any;
  SideFilterComponent?: any;
  GridComponent?: any;
  CardComponent?: any;
  NoResultsComponent?: any;
  PagerComponent?: any;

  // Handlers
  onHandleChange?: (selections: IDefaultSelections, gridViewChangeType: GridViewChangeType) => void; // For every change like paging, sorting, selections, filters this handler will be called
  onGridRowItemClick?: (column: any, item: any) => void;

  onExport?: (exportOption: IExportOptions, selections?: IDefaultSelections) => void;
  onRefresh?: () => void;
  onItemsUpdate?: (items: any[], operationType: OperationType) => void;

  // styles
  gridContainerClass?: string; // This class is for the whole grid view container
  actionSectionClass?: string; // This class is the container for the action section, filters, message section
  gridMainClass?: string; // this class is the container for grid view summary, gridview data and pager section
  gridDataClass?: string; // this class is the container for grid view data alone
  detailsListClass?: string; // this class is the container for grid view data alone
}

export interface IGridColumn extends IColumn {
  selected?: boolean; // whether column will be shown or not
  required?: boolean; // its a required column and cant be removed from column selection. it is by default selected
  searchable?: boolean; // this enables quick search on this column
  filterType?: FilterType; //type of filter
  filterDataType?: FilterDataType; // data type of the filter. this is must when using filter type
  filterOrder?: number; // order of the filter
  filterItemsSearchRequired?: boolean; //if search box is required for the filter items when the filter items are more
  filterItems?: IGridFilterItem[]; // Pass this when Grid view type is Server side
  hideSelectAll?: boolean;
  disableSort?: boolean;
  grouping?: boolean; // enables grouping for the gridview
  groupLevel?: number; // Pass this only when multi level grouping is required. For single group level this property is not required
  getGroupName?: (groupValue: any, groupItems?: any[]) => string; // return a custom group name as per the column
  FilterComponent?: any; // custom way to render filter
  applyFilter?: (filter: IGridFilter, items: any[]) => any[]; //custom way to filter the data. this is must when FilterComponent is passed
  applySearchText?: (searchText: string, items: any[]) => any[]; //custom way to apply the quick search

  //Option for Add/Edit
  readonly?: boolean;
  editControlType?: ControlType;
  editControlOptions?: IControlOption[];
  formatValue?: (value: string, item?: any) => string;
  onRenderEditControl?: (
    item: any,
    onChange: (column: IGridColumn, value: string, item: any) => void,
    column?: IGridColumn
  ) => any;
  onRenderBackup?: (item: any, index?: number, column?: IGridColumn) => any;
  onValidate?: (value: any, column?: IGridColumn, item?: any) => string;
}

export interface IControlOption {
  key: string;
  text: string;
  data?: any;
}

export interface IConfirmation {
  showConfirmation: boolean;
  data?: any;
  confirmCallback?: (data: any) => void;
}

export interface IQuickActionSectionParams {
  gridViewType: GridViewType;
  columns?: IGridColumn[];
  sortingOptions?: ISortingOptions[];
  sortLevel?: number; //number of columns part of multi sort
  groupColumn?: IGridColumn;
  showQuickSearch: boolean;
  searchText?: string;
  searchPlaceHolderText?: string;
  showFilters: boolean;
  exportOptions?: IExportOptions[];
  selectedItems?: any[];
  actionBarItems?: IActionBarItems;
  quickActionSectionItems?: IQucickActionSectionItem[];
  allowGroupSelection?: boolean;
  quickSearchOnEnter?: boolean;
  hideQuickSearchButton?: boolean;
  hideColumnPicker?: boolean;
  allowMultiLevelSorting?: boolean;
  onSearchTextChange?: (value: string) => void;
  onColumnChange?: (columns: IGridColumn[]) => void;
  onGroupColumnChange?: (column?: IGridColumn) => void;
  toggleFilters?: (showFilters: any) => void;
  onRefresh?: () => void;
  onExport?: (fileType: string) => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onSort?: (sortingOptions: ISortingOptions[]) => void;
}

export interface IQucickActionSectionItem {
  key: string;
  type: GridViewActionBarItems;
  alignment: QucickActionSectionAlignment;
  label?: string;
  icon?: string;
  className?: string;
  order?: number;
  options?: any;
  onClick?: () => void;
  onRender?: (quickActionSectionItem?: IQucickActionSectionItem) => any; //override if it needs to be rendered in custom way
}

export interface IActionBarItems {
  actionBarLeftItems?: GridViewActionBarItems[];
  actionBarRightItems?: GridViewActionBarItems[];
}

export interface IExportOptions {
  fileType: string;
  iconName?: string;
}

export interface IGridViewCallbacks {
  onSelectionChange?: () => void;
  onColumnClick?: (e: React.MouseEvent<HTMLElement>, column: IGridColumn) => void;
  onGroupHeaderRender?: (e: React.MouseEvent<HTMLElement>, column: IGridColumn) => void;
}

export interface IFilterTagProps {
  filters: IGridFilter[];
  maxFilterTagLength?: number;
  onClearFilters?: () => void;
  onRemoveFilter?: (key: string) => void;
  onChangeFilter?: (filter: IGridFilter) => void;
  onApplyFilter?: (filter: IGridFilter) => void;
}

export interface IGridFilterProps {
  filters: IGridFilter[];
  onFilterChange: (filter: IGridFilter) => void;
  onApplyFilters?: () => void;
}

export interface IGridViewMessageData extends IGridViewMessage {
  id: string;
  timestamp: Date;
  removePending?: boolean;
}

export interface IGridViewMessage {
  messageType: GridViewMessageType;
  message: string;
  autoDismiss?: boolean;
}

export interface IStatusMessageProps {
  messages: IGridViewMessageData[];
  onDismiss?: (messages: IGridViewMessageData) => void;
}

export interface ISummaryParams {
  pageNumber?: number;
  pageSize?: number;
  totalCount: number;
  selectionCount?: number;
  hideCountMessage?: boolean;
}

export interface ITimeLineRange {
  timeLineKey: number;
  timeLineLabel: string;
  startDate: Date;
  endDate: Date;
}

export interface IGroupData {
  groups?: IGroup[];
  items: any[];
}

export interface IGroupItem {
  groupName: string;
  items: any[];
}

export interface IGroupField {
  fieldName: string;
  level: number;
  getGroupName?: (groupValue: any, groupItems?: any[]) => string;
  onRenderGroupHeader?: (e: any) => any;
}
