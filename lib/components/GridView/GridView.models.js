export var GridViewType;
(function (GridViewType) {
    GridViewType[GridViewType["InMemory"] = 0] = "InMemory";
    GridViewType[GridViewType["ServerSide"] = 1] = "ServerSide";
})(GridViewType || (GridViewType = {}));
export var FilterType;
(function (FilterType) {
    FilterType[FilterType["SelectionFilter"] = 0] = "SelectionFilter";
    FilterType[FilterType["RangeFilter"] = 1] = "RangeFilter";
    FilterType[FilterType["ToggleFilter"] = 2] = "ToggleFilter";
    FilterType[FilterType["TimeLineFilter"] = 3] = "TimeLineFilter";
    FilterType[FilterType["Custom"] = 4] = "Custom";
})(FilterType || (FilterType = {}));
export var FilterOperation;
(function (FilterOperation) {
    FilterOperation[FilterOperation["Equal"] = 0] = "Equal";
    FilterOperation[FilterOperation["GreaterThanEqual"] = 1] = "GreaterThanEqual";
    FilterOperation[FilterOperation["LessThanEqual"] = 2] = "LessThanEqual";
    FilterOperation[FilterOperation["Between"] = 3] = "Between";
})(FilterOperation || (FilterOperation = {}));
export var TimelineFilterType;
(function (TimelineFilterType) {
    TimelineFilterType[TimelineFilterType["Q1"] = 0] = "Q1";
    TimelineFilterType[TimelineFilterType["Q2"] = 1] = "Q2";
    TimelineFilterType[TimelineFilterType["Q3"] = 2] = "Q3";
    TimelineFilterType[TimelineFilterType["Q4"] = 3] = "Q4";
    TimelineFilterType[TimelineFilterType["Custom"] = 4] = "Custom";
})(TimelineFilterType || (TimelineFilterType = {}));
export var GridViewActionBarItems;
(function (GridViewActionBarItems) {
    GridViewActionBarItems[GridViewActionBarItems["Custom"] = 0] = "Custom";
    GridViewActionBarItems[GridViewActionBarItems["RefreshButton"] = 1] = "RefreshButton";
    GridViewActionBarItems[GridViewActionBarItems["ExportButton"] = 2] = "ExportButton";
    GridViewActionBarItems[GridViewActionBarItems["EditButton"] = 3] = "EditButton";
    GridViewActionBarItems[GridViewActionBarItems["DeleteButton"] = 4] = "DeleteButton";
    GridViewActionBarItems[GridViewActionBarItems["GroupColumnsButton"] = 5] = "GroupColumnsButton";
    GridViewActionBarItems[GridViewActionBarItems["ColumnsButton"] = 6] = "ColumnsButton";
    GridViewActionBarItems[GridViewActionBarItems["FilterButton"] = 7] = "FilterButton";
    GridViewActionBarItems[GridViewActionBarItems["SearchBox"] = 8] = "SearchBox";
    GridViewActionBarItems[GridViewActionBarItems["SortButton"] = 9] = "SortButton";
})(GridViewActionBarItems || (GridViewActionBarItems = {}));
export var FilterDataType;
(function (FilterDataType) {
    FilterDataType[FilterDataType["String"] = 0] = "String";
    FilterDataType[FilterDataType["Number"] = 1] = "Number";
    FilterDataType[FilterDataType["Date"] = 2] = "Date";
    FilterDataType[FilterDataType["Boolean"] = 3] = "Boolean";
})(FilterDataType || (FilterDataType = {}));
export var GridViewMessageType;
(function (GridViewMessageType) {
    GridViewMessageType[GridViewMessageType["Information"] = 0] = "Information";
    GridViewMessageType[GridViewMessageType["Success"] = 1] = "Success";
    GridViewMessageType[GridViewMessageType["Warning"] = 2] = "Warning";
    GridViewMessageType[GridViewMessageType["Error"] = 3] = "Error";
    GridViewMessageType[GridViewMessageType["SevereWarning"] = 4] = "SevereWarning";
    GridViewMessageType[GridViewMessageType["Blocked"] = 5] = "Blocked";
})(GridViewMessageType || (GridViewMessageType = {}));
export var QucickActionSectionAlignment;
(function (QucickActionSectionAlignment) {
    QucickActionSectionAlignment[QucickActionSectionAlignment["Left"] = 0] = "Left";
    QucickActionSectionAlignment[QucickActionSectionAlignment["Right"] = 1] = "Right";
})(QucickActionSectionAlignment || (QucickActionSectionAlignment = {}));
export var ColumnActionsMode;
(function (ColumnActionsMode) {
    /** Renders the column header as disabled. */
    ColumnActionsMode[ColumnActionsMode["disabled"] = 0] = "disabled";
    /** Renders the column header as clickable. Default value. */
    ColumnActionsMode[ColumnActionsMode["clickable"] = 1] = "clickable";
    /** Renders the column header as clickable and displays the dropdown chevron. */
    ColumnActionsMode[ColumnActionsMode["hasDropdown"] = 2] = "hasDropdown";
})(ColumnActionsMode || (ColumnActionsMode = {}));
export var GridViewChangeType;
(function (GridViewChangeType) {
    GridViewChangeType[GridViewChangeType["SelectedFilters"] = 0] = "SelectedFilters";
    GridViewChangeType[GridViewChangeType["SearchText"] = 1] = "SearchText";
    GridViewChangeType[GridViewChangeType["Pagination"] = 2] = "Pagination";
    GridViewChangeType[GridViewChangeType["Sorting"] = 3] = "Sorting";
    GridViewChangeType[GridViewChangeType["SelectedItems"] = 4] = "SelectedItems";
    GridViewChangeType[GridViewChangeType["GroupBy"] = 5] = "GroupBy";
})(GridViewChangeType || (GridViewChangeType = {}));
export var GridViewGroupLabelType;
(function (GridViewGroupLabelType) {
    GridViewGroupLabelType[GridViewGroupLabelType["GroupValue"] = 0] = "GroupValue";
    GridViewGroupLabelType[GridViewGroupLabelType["GroupValueAndCount"] = 1] = "GroupValueAndCount";
    GridViewGroupLabelType[GridViewGroupLabelType["ColumnNameAndGroupValueAndCount"] = 2] = "ColumnNameAndGroupValueAndCount";
})(GridViewGroupLabelType || (GridViewGroupLabelType = {}));
export var ActionBarSectionType;
(function (ActionBarSectionType) {
    ActionBarSectionType[ActionBarSectionType["Left"] = 0] = "Left";
    ActionBarSectionType[ActionBarSectionType["Right"] = 1] = "Right";
})(ActionBarSectionType || (ActionBarSectionType = {}));
export const DEFAULT_MESSAGE_DISMISS_TIME = 5000;
export const FILTER_ITEM_TEXT_FIELD = 'label';
export const FILTER_ITEM_VALUE_FIELD = 'value';
export const QUATER_START_MONTH = 6;
export const QUATER_START_YEAR = new Date().getMonth() >= QUATER_START_MONTH
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