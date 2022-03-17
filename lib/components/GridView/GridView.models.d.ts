import React from 'react';
import { IColumn, IDetailsListProps, IGroup } from '@fluentui/react/lib/DetailsList';
import { IGridViewActions } from './GridView.actions';
import { PageType } from '../Pagination/Pagination.models';
export declare enum GridViewType {
    InMemory = 0,
    ServerSide = 1
}
export declare enum FilterType {
    SelectionFilter = 0,
    RangeFilter = 1,
    ToggleFilter = 2,
    TimeLineFilter = 3,
    Custom = 4
}
export declare enum FilterOperation {
    Equal = 0,
    GreaterThanEqual = 1,
    LessThanEqual = 2,
    Between = 3
}
export declare enum TimelineFilterType {
    Q1 = 0,
    Q2 = 1,
    Q3 = 2,
    Q4 = 3,
    Custom = 4
}
export declare enum GridViewActionBarItems {
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
export declare enum FilterDataType {
    String = 0,
    Number = 1,
    Date = 2,
    Boolean = 3
}
export declare enum GridViewMessageType {
    Information = 0,
    Success = 1,
    Warning = 2,
    Error = 3,
    SevereWarning = 4,
    Blocked = 5
}
export declare enum QucickActionSectionAlignment {
    Left = 0,
    Right = 1
}
export declare enum GridViewChangeType {
    SelectedFilters = 0,
    SearchText = 1,
    Pagination = 2,
    Sorting = 3,
    SelectedItems = 4,
    GroupBy = 5
}
export declare enum GridViewGroupLabelType {
    GroupValue = 0,
    GroupValueAndCount = 1,
    ColumnNameAndGroupValueAndCount = 2
}
export declare enum ActionBarSectionType {
    Left = 0,
    Right = 1
}
export declare enum ControlType {
    TextBox = 0,
    ComboBox = 1,
    DatePicker = 2,
    Custom = 3
}
export declare enum OperationType {
    Add = 0,
    Edit = 1,
    Delete = 2
}
export declare const DEFAULT_MESSAGE_DISMISS_TIME = 5000;
export declare const FILTER_ITEM_TEXT_FIELD = "label";
export declare const FILTER_ITEM_VALUE_FIELD = "value";
export declare const QUATER_START_MONTH = 6;
export declare const QUATER_START_YEAR: number;
export declare const OPERATIONS_MAP: {
    0: string;
    1: string;
    2: string;
    3: string;
};
export declare const OPERATIONS_STRINGS_MAP: {
    0: string;
    1: string;
    2: string;
    3: string;
};
export declare const OPERATIONS_DATE_STRINGS_MAP: {
    0: string;
    1: string;
    2: string;
    3: string;
};
export declare const TIME_LINE_FILTER_TYPE_MAP: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
};
export declare const GRIDVIEW_LOCALIZATION_STRINGS: {
    ADD: {
        id: string;
        defaultMessage: string;
    };
    CONFIRMATION: {
        id: string;
        defaultMessage: string;
    };
    CONFIRMATION_MESSAGE: {
        id: string;
        defaultMessage: string;
    };
    CLEAR_FILTERS: {
        id: string;
        defaultMessage: string;
    };
    SELECT_DATE: {
        id: string;
        defaultMessage: string;
    };
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
    applyFilter?: (filter: IGridFilter, items: any[]) => any[];
}
export interface IGridFilterItem {
    label: string;
    value: any;
    selected?: boolean;
    count?: number;
    onRenderLabel?: (props: any) => any;
}
export interface ISearchField {
    fieldName: string;
    label: string;
    applySearchText?: (filterText: string, items: any[]) => any[];
}
export interface IGridViewParams extends IDetailsListProps {
    gridViewType: GridViewType;
    items: any[];
    totalRecords?: number;
    columns: IGridColumn[];
    allowMultiLevelSorting?: boolean;
    sortLevel?: number;
    removeSorting?: boolean;
    allowSelection?: boolean;
    allowGrouping?: boolean;
    allowGroupSelection?: boolean;
    isLoading?: boolean;
    quickSearchOnEnter?: boolean;
    hideQuickSearch?: boolean;
    hideQuickSearchButton?: boolean;
    hideQuickActionSection?: boolean;
    hideColumnPicker?: boolean;
    hidePaging?: boolean;
    hideFilters?: boolean;
    hideGridSummary?: boolean;
    highLightSearchText?: boolean;
    hideClearFilters?: boolean;
    selectFirstItemOnLoad?: boolean;
    showFiltersAside?: boolean;
    showFiltersOnLoad?: boolean;
    allowAdd?: boolean;
    allowEdit?: boolean;
    allowDelete?: boolean;
    hideInlineEdit?: boolean;
    hideInlineDelete?: boolean;
    hideBulkEdit?: boolean;
    hideBulkDelete?: boolean;
    pagingOptions?: IPagingOptions;
    pagingOptionsWithoutPage?: IPagingOptionsWithoutPage;
    sortingOptions?: ISortingOptions[];
    selectedFilters?: IGridFilter[];
    selectedItems?: any[];
    searchText?: string;
    groupBy?: string;
    groups?: IGroup[];
    itemUniqueField?: string;
    searchPlaceHolderText?: string;
    searchFields?: ISearchField[];
    filters?: IGridFilter[];
    statusMessages?: IGridViewMessage[];
    maxSelection?: Number;
    maxFilterTagLength?: number;
    exportOptions?: IExportOptions[];
    quickActionSectionItems?: IQucickActionSectionItem[];
    QuickActionSectionComponent?: any;
    FilterTagsComponent?: any;
    GridSummaryComponent?: any;
    StatusMessageSectionComponent?: any;
    SideFilterComponent?: any;
    GridComponent?: any;
    CardComponent?: any;
    NoResultsComponent?: any;
    PagerComponent?: any;
    onHandleChange?: (selections: IDefaultSelections, gridViewChangeType: GridViewChangeType) => void;
    onGridRowItemClick?: (column: any, item: any) => void;
    onExport?: (exportOption: IExportOptions, selections?: IDefaultSelections) => void;
    onRefresh?: () => void;
    onItemsUpdate?: (items: any[], operationType: OperationType) => void;
    gridContainerClass?: string;
    actionSectionClass?: string;
    gridMainClass?: string;
    gridDataClass?: string;
    detailsListClass?: string;
}
export interface IGridColumn extends IColumn {
    selected?: boolean;
    required?: boolean;
    searchable?: boolean;
    filterType?: FilterType;
    filterDataType?: FilterDataType;
    filterOrder?: number;
    filterItemsSearchRequired?: boolean;
    filterItems?: IGridFilterItem[];
    hideSelectAll?: boolean;
    disableSort?: boolean;
    grouping?: boolean;
    groupLevel?: number;
    getGroupName?: (groupValue: any, groupItems?: any[]) => string;
    FilterComponent?: any;
    applyFilter?: (filter: IGridFilter, items: any[]) => any[];
    applySearchText?: (searchText: string, items: any[]) => any[];
    readonly?: boolean;
    editControlType?: ControlType;
    editControlOptions?: IControlOption[];
    formatValue?: (value: string, item?: any) => string;
    onRenderEditControl?: (item: any, onChange: (column: IGridColumn, value: string, item: any) => void, column?: IGridColumn) => any;
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
    sortLevel?: number;
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
    onRender?: (quickActionSectionItem?: IQucickActionSectionItem) => any;
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
