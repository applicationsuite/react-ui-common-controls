import { IGridViewActions } from './GridView.actions';




export enum GridViewType {
  InMemory = 0,
  ServerSide = 1
}

export interface IGridViewContextData {
  state: IGridViewData;
  actions: IGridViewActions;
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
  SortButton = 9
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

export enum ColumnActionsMode {
  /** Renders the column header as disabled. */
  disabled = 0,
  /** Renders the column header as clickable. Default value. */
  clickable = 1,
  /** Renders the column header as clickable and displays the dropdown chevron. */
  hasDropdown = 2
}

export interface IDefaultSelections {
  pagingOptions?: IPagingOptions;
  sortingOptions?: ISortingOptions[];
  selectedFilters?: IGridFilter[];
  searchText?: string;
  selectedItems?: any[];
  groupBy?: string;
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

export const GRIDVIEW_LOCALIZATION_CONSTANTS = {
  CLEAR_FILTERS: {
    id: 'Core.GridView.ClearFilters',
    defaultMessage: 'Clear Filters'
  }
};

export interface IGridViewData {
  gridViewType: GridViewType;
  items: any[];
  totalRecords?: number;
  itemUniqueField?: string;
  columns?: IGridColumn[];
  groups?: any[];
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
  filtersToApply?: IGridFilter[];
  filterToApply?: IGridFilter;
}

export interface IPagingOptionsWithoutPage {
  isNextAllowed: boolean;
  isPreviousAllowed: boolean;
}

export interface IPagingOptions {
  pageSize: number;
  pageNumber: number;
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

export interface IGridViewParams {
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

  // Selections
  pagingOptions?: IPagingOptions; // paging options for the gridview
  pagingOptionsWithoutPage?: IPagingOptionsWithoutPage; // use this when page number and total records are unknown.
  sortingOptions?: ISortingOptions[]; // sorting options for the gridview
  selectedFilters?: IGridFilter[]; // filter options for the gridview
  selectedItems?: any[]; // selected items to enable default selection. To enable default selection you need to pass the itemUniqueField.
  searchText?: string; // Search Text value which needs to be shown in quick search text box
  groupBy?: string; //Default group by column

  // Other Data

  itemUniqueField?: string; // This is the name of the field which is unique in the item collection. It must be passed when quick search or selection is required
  searchPlaceHolderText?: string; // place holder text for the quick search text box.
  searchFields?: ISearchField[]; // this represents what item fields upon which quick search will be applied. You need to pass the itemUniqueField when u pass more than one field.
  filters?: IGridFilter[]; // This you need when you need custom filters.  Most of the filter features are part of columns so please make use of that.

  maxSelection?: Number; // if you want a limit on maximum number of item selection
  maxFilterTagLength?: number; // max length of visible filter tag values
  exportOptions?: IExportOptions[]; // export options is for export functionality
  /**
   * @deprecated actionBarItems will be removed in future versions. Please use quickActionBarItems instead.
   */
  actionBarItems?: IActionBarItems; // this is to customize the action bar items like filters, quick search
  quickActionSectionItems?: IQucickActionSectionItem[]; // this is to customize the action bar items like filters, quick search

  // React Components. Use this if you want to pass a custom component for individual section
  /**
   * @deprecated QuickActionSection will be removed in future versions. Please use quickActionSectionItems custom onReder instead.
   */
  QuickActionSection?: any;
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
  onEdit?: (item?: any) => void;
  onDelete?: (items?: any[]) => void;

  // styles
  gridContainerClass?: string; // This class is for the whole grid view container
  actionSectionClass?: string; // This class is the container for the action section, filters, message section
  gridMainClass?: string; // this class is the container for grid view summary, gridview data and pager section
  gridDataClass?: string; // this class is the container for grid view data alone
}

export interface IGridColumn {
  /** A unique key for identifying the column. */
  key: string;
  /** Name to render on the column header. */
  name: string;
  /**
   * The field to pull the text value from for the column.
   * Can be unset if a custom `onRender` method is provided.
   */
  fieldName?: string;

  /** Class name to apply to the column cell within each row. */
  className?: string;
  /** Custom overrides to the themed or default styles. */

  /** Minimum width for the column. */
  minWidth: number;

  /** Maximum width for the column, if stretching is allowed in justified scenarios. */
  maxWidth?: number;

  /**
   * Accessible label for the column. The column name will still be used as the primary label,
   * but this text (if specified) will be read after the column name.
   */
  ariaLabel?: string;

  /** Custom renderer for cell content, instead of the default text rendering. */
  onRender?: (item?: any, index?: number, column?: IGridColumn) => any;

  /** Callback for when the user clicks on the column header. */
  onColumnClick?: (ev: React.MouseEvent<HTMLElement>, column: IGridColumn) => void;

  /**
   * Accessible label for indicating that the list is sorted by this column in ascending order.
   * This will be read after the main column header label.
   */
  sortAscendingAriaLabel?: string;
  /**
   * Accessible label for indicating that the list is sorted by this column in descending order.
   * This will be read after the main column header label.
   */
  sortDescendingAriaLabel?: string;

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

export interface IGroup {
  key: string;
  name?: string;
  level?: number;
  children?: any;
  groupName?: string;
  startIndex: number;
  count: number;
  data?: any;
}

export interface IGroupData {
  groups?: any[];
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