import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { Shimmer, ShimmerElementType } from '@fluentui/react/lib/Shimmer';
import { PrimaryButton, DefaultButton, CommandBarButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { ComboBox } from '@fluentui/react/lib/ComboBox';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { DayOfWeek } from '@fluentui/react/lib/DateTimeUtilities';
import { Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ColumnActionsMode } from '@fluentui/react/lib/DetailsList';
import { cloneDeep } from 'lodash';
import { GridViewType, GridViewChangeType, DEFAULT_MESSAGE_DISMISS_TIME, OperationType, GRIDVIEW_LOCALIZATION_STRINGS, ControlType } from './GridView.models';
import { GridViewDefault } from './GridViewDefault';
import { useInit, getFilteredSelectedItems, getUpdateFilters } from './GridView.hooks';
import { Pagination, PaginationWithoutPages } from '../Pagination';
import { QuickActionSection as QuickActionSectionDefault } from './QuickActionSection';
import { FilterTags } from './FilterTag';
import { GridFilterPanel, GridFilters } from './GridFilters';
import { StatusMessages } from './StatusMessage';
import { GridSummary } from './GridSummary';
import { gridViewStyles } from './GridView.styles';
import { HighlightText } from '../HighlightText';
import { SORT_TYPE } from '../../constants';
import { GridViewContext } from './GridView.context';
import { useLocalization, localizedString } from '../LanguageProvider/locallizationUtil';
import { COMMON_LOCALIZATION_STRINGS } from '../../constants/CommonConstants';
const useStyles = createUseStyles(gridViewStyles);
let isInitialLoad = false;
export const GridView = (props) => {
    // #region "State initialization"
    const classes = useStyles();
    const { QuickActionSectionComponent, GridSummaryComponent, FilterTagsComponent, GridComponent, CardComponent, SideFilterComponent, StatusMessageSectionComponent, NoResultsComponent, PagerComponent } = props;
    const callBacks = {
        onColumnClick,
        onSelectionChange
    };
    const { state, actions, selection } = useInit(props, callBacks);
    const [confirmation, setConfirmation] = React.useState({
        showConfirmation: false
    });
    const stateRef = React.useRef();
    const actionsRef = React.useRef();
    stateRef.current = state;
    actionsRef.current = actions;
    const localization = useLocalization();
    React.useEffect(() => {
        updateMessageList(props.statusMessages);
    }, [props.statusMessages]);
    // #endregion "State initialization"
    // #region "Event Handler Section"
    function onSelectionChange() {
        const currentActions = actionsRef.current;
        const selections = selection.getSelection();
        currentActions.applySelectedItems(selections);
        let newItems = selections.filter((item) => item.isDirty === true && item.isNewItem === true);
        if (newItems.length === selections.length) {
            return;
        }
        if (!isInitialLoad) {
            props.onHandleChange &&
                props.onHandleChange(getSelections(GridViewChangeType.SelectedItems, selections), GridViewChangeType.SelectedItems);
        }
        isInitialLoad = false;
    }
    React.useEffect(() => {
        if (!props.allowSelection) {
            return;
        }
        let filteredSelectedItems = getFilteredSelectedItems(props.items, props.selectedItems, props.itemUniqueField);
        if (!compareSelections(filteredSelectedItems, state.selectedItems)) {
            props.selectedItems && updateSelections(filteredSelectedItems, props.itemUniqueField);
        }
    }, [props.selectedItems]);
    const compareSelections = (selections = [], oldSelections = []) => {
        const newSelectedKeys = selections.map((item) => item[props.itemUniqueField]);
        const oldSelectedKeys = oldSelections.map((item) => item[props.itemUniqueField]);
        return JSON.stringify(newSelectedKeys) === JSON.stringify(oldSelectedKeys);
    };
    const updateSelections = (selectedItems, itemUniqueField) => {
        if (selection.getSelection().length > 0) {
            isInitialLoad = true;
            selection.setAllSelected(false);
        }
        selectedItems &&
            selectedItems.length &&
            selectedItems.forEach((item) => {
                let index = props.items.findIndex((i) => i[itemUniqueField] === item[itemUniqueField]);
                if (index >= 0) {
                    isInitialLoad = true;
                    selection && selection.setIndexSelected(index, true, false);
                }
            });
    };
    const getItems = () => {
        const items = props.allowAdd || props.hidePaging || props.allowGrouping
            ? state.filteredItems
            : props.gridViewType === GridViewType.InMemory
                ? state.paginatedFilteredItems
                : state.items;
        return items;
    };
    const getSelections = (changeType, value) => {
        var _a;
        const defaultSelections = {
            searchText: changeType === GridViewChangeType.SearchText ? value : stateRef.current.searchText || '',
            pagingOptions: changeType === GridViewChangeType.Pagination ? value : stateRef.current.pagingOptions,
            sortingOptions: changeType === GridViewChangeType.Sorting ? value : stateRef.current.sortingOptions,
            selectedFilters: changeType === GridViewChangeType.SelectedFilters
                ? value
                : stateRef.current.selectedFilters,
            selectedItems: changeType === GridViewChangeType.SelectedItems ? value : stateRef.current.selectedItems,
            groupBy: changeType === GridViewChangeType.GroupBy ? value : (_a = stateRef.current.groupColumn) === null || _a === void 0 ? void 0 : _a.key
        };
        return defaultSelections;
    };
    const updateMessageList = (newMessages = []) => {
        const newMessageList = [];
        newMessages &&
            newMessages.forEach((item, index) => {
                const newMessage = {
                    id: (new Date().getTime() + index).toString(),
                    message: item.message,
                    messageType: item.messageType,
                    timestamp: new Date(),
                    autoDismiss: item.autoDismiss
                };
                newMessageList.push(newMessage);
            });
        const messages = newMessageList.concat(state.statusMessages || []);
        actions.setData({ statusMessages: messages });
        let filteredMessages = messages.filter((msg) => msg.autoDismiss === true);
        filteredMessages = filteredMessages.filter((item) => item.removePending === undefined);
        filteredMessages.forEach((item) => {
            item.removePending = true;
        });
        filteredMessages.forEach((item) => {
            if (item.autoDismiss) {
                setTimeout(() => {
                    onDismissMessage(item, true);
                }, DEFAULT_MESSAGE_DISMISS_TIME);
            }
        });
    };
    const getUpdatedMessageList = (messages = []) => messages.slice(0, 2);
    const onDismissMessage = (message, useRef) => {
        var _a;
        const messages = [...(useRef ? (_a = stateRef.current) === null || _a === void 0 ? void 0 : _a.statusMessages : state.statusMessages || [])];
        const index = messages.findIndex((item) => item.id === message.id);
        if (index > -1) {
            messages.splice(index, 1);
            actions.setData({ statusMessages: messages });
        }
    };
    const onToggleFilter = (showFilter) => {
        if (!props.showFiltersAside && showFilter && props.gridViewType === GridViewType.ServerSide) {
            actions.setData({ availableFilters: cloneDeep(state.filters) });
            actions.setData({ filtersToApply: cloneDeep(state.selectedFilters) });
        }
        actions.setData({ showFilters: !state.showFilters });
    };
    function onColumnClick(e, column) {
        onColumnSort(e, column);
    }
    const resetSelection = () => {
        if (props.allowSelection && selection && selection.count > 0) {
            isInitialLoad = true;
            stateRef.current.selectedItems = [];
            selection.setAllSelected(false);
        }
    };
    const onColumnSort = (e, column) => {
        const currentState = stateRef.current;
        const currentActions = actionsRef.current;
        if (!(currentState && currentState.columns))
            return;
        let sortingOptions = currentState.sortingOptions && currentState.sortingOptions.length
            ? currentState.sortingOptions[0]
            : undefined;
        const columns = currentState.columns || [];
        let sortColumn = sortingOptions ? sortingOptions.sortColumn : '';
        const colIndex = columns.findIndex((item) => item.key === column.key);
        if (sortColumn === column.key) {
            columns[colIndex].isSortedDescending = !columns[colIndex].isSortedDescending;
        }
        else {
            columns.forEach((col) => {
                col.isSorted = false;
            });
            columns[colIndex].isSorted = true;
            sortColumn = column.key;
        }
        sortingOptions = {
            sortType: columns[colIndex].isSortedDescending === true ? SORT_TYPE.DESC : SORT_TYPE.ASC,
            sortColumn,
            sortField: column.fieldName
        };
        currentActions.applySorting(currentState.filteredItems, [sortingOptions], columns);
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.Sorting, [sortingOptions]), GridViewChangeType.Sorting);
    };
    const onPaginationChange = (pageNumber, pageSize) => {
        var _a, _b;
        if (pageNumber === ((_a = state.pagingOptions) === null || _a === void 0 ? void 0 : _a.pageNumber) &&
            pageSize === ((_b = state.pagingOptions) === null || _b === void 0 ? void 0 : _b.pageSize)) {
            return;
        }
        // pagingChange = true;
        const pagingOptions = state.pagingOptions;
        if (pageNumber) {
            pagingOptions.pageNumber = pageNumber;
        }
        if (pageSize) {
            pagingOptions.pageSize = pageSize;
        }
        actions.applyPaging(state.filteredItems, pagingOptions);
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.Pagination, pagingOptions), GridViewChangeType.Pagination);
    };
    const onPageChangeWithoutPages = (pageType) => {
        // pagingChange = true;
        const pagingOptions = {
            pageNumber: -1,
            pageSize: -1,
            pageType
        };
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.Pagination, pagingOptions), GridViewChangeType.Pagination);
    };
    const onFiltersChange = (filters) => {
        actions.applyFilters(state.items, filters);
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.SelectedFilters, filters), GridViewChangeType.SelectedFilters);
    };
    const onFilterChange = (filter) => {
        let selectedFilters = props.gridViewType === GridViewType.InMemory || props.showFiltersAside
            ? state.selectedFilters
            : state.filtersToApply;
        selectedFilters = selectedFilters || [];
        const filterIndex = selectedFilters.findIndex((item) => item.id === filter.id);
        if (filterIndex > -1) {
            selectedFilters[filterIndex] = filter;
        }
        else {
            selectedFilters.push(filter);
        }
        selectedFilters = selectedFilters.filter((selectedFilter) => selectedFilter.values && selectedFilter.values.length > 0);
        selectedFilters = selectedFilters.map((item) => {
            item.isCurrent = filter ? filter.id === item.id : false;
            return item;
        });
        if (props.gridViewType === GridViewType.InMemory || props.showFiltersAside) {
            onFiltersChange(selectedFilters);
        }
        else {
            actions.setData({ filtersToApply: selectedFilters });
            const filters = getUpdateFilters(state.availableFilters || [], selectedFilters, [], undefined, false);
            actions.setData({ availableFilters: filters });
        }
    };
    const onApplyFilters = () => {
        onFiltersChange(state.filtersToApply);
        actions.setData({ showFilters: false, filtersToApply: [] });
    };
    const onApplyFilter = (filter) => {
        let { selectedFilters } = state;
        selectedFilters = selectedFilters || [];
        const filterIndex = selectedFilters.findIndex((item) => item.id === filter.id);
        selectedFilters[filterIndex] = filter;
        selectedFilters = selectedFilters.filter((selectedFilter) => selectedFilter.values && selectedFilter.values.length > 0);
        selectedFilters = selectedFilters.map((item) => {
            item.isCurrent = filter ? filter.id === item.id : false;
            return item;
        });
        onFiltersChange(selectedFilters);
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.SelectedFilters, selectedFilters), GridViewChangeType.SelectedFilters);
    };
    const onSearchTextChange = (searchText) => {
        actions.applyFilterText(state.items, searchText);
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.SearchText, searchText), GridViewChangeType.SearchText);
    };
    const onColumnChange = (columns) => {
        actions.applySelectedColumns(columns);
    };
    const onRemoveFilter = (filterKey) => {
        if (!(state.selectedFilters && state.selectedFilters.length > 0)) {
            return;
        }
        state.selectedFilters = state.selectedFilters.filter((item) => item.id !== filterKey);
        onFiltersChange(state.selectedFilters);
    };
    const onClearFilters = () => {
        if (!(state.selectedFilters && state.selectedFilters.length > 0)) {
            return;
        }
        onFiltersChange([]);
    };
    const onSort = (sortingOptions) => {
        const currentState = stateRef.current;
        const currentActions = actionsRef.current;
        currentActions.applySorting(currentState.filteredItems, sortingOptions, currentState.columns);
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.Sorting, sortingOptions), GridViewChangeType.Sorting);
    };
    const onExport = (fileType) => {
        const selections = getSelections();
        const exportOptions = {
            fileType
        };
        props.onExport && props.onExport(exportOptions, selections);
    };
    const onEdit = () => {
        const selections = getSelections();
        onEditRecords(selections.selectedItems || []);
    };
    const onSave = () => {
        let itemsToUpdate = getItemsToEdit();
        onSaveRecords(itemsToUpdate);
    };
    const onCancel = () => {
        let itemsToUpdate = getItemsToEdit();
        onCancelRecords(itemsToUpdate);
    };
    const getItemsToEdit = () => {
        var _a, _b;
        let itemsToUpdate = ((_b = (_a = stateRef.current) === null || _a === void 0 ? void 0 : _a.filteredItems) === null || _b === void 0 ? void 0 : _b.filter((item) => item.isDirty === true)) || [];
        return itemsToUpdate;
    };
    const onDelete = () => {
        const selections = getSelections();
        setConfirmation({
            showConfirmation: true,
            data: selections.selectedItems,
            confirmCallback: onDeleteRecords
        });
    };
    const onGroupColumnChange = (column) => {
        var _a;
        if (state.groupColumn && column && state.groupColumn.key === column.key) {
            return;
        }
        actions.applyGrouping(column);
        resetSelection();
        props.onHandleChange &&
            props.onHandleChange(getSelections(GridViewChangeType.GroupBy, (_a = state.groupColumn) === null || _a === void 0 ? void 0 : _a.key), GridViewChangeType.GroupBy);
    };
    const onAddRecord = () => {
        var _a;
        (_a = actionsRef.current) === null || _a === void 0 ? void 0 : _a.addRecord();
    };
    const onEditRecords = (items) => {
        var _a;
        (_a = actionsRef.current) === null || _a === void 0 ? void 0 : _a.editRecords(items);
    };
    const onDeleteRecords = (items) => {
        var _a;
        const status = (_a = actionsRef.current) === null || _a === void 0 ? void 0 : _a.deleteRecords(items);
        status && props.onItemsUpdate && props.onItemsUpdate(items, OperationType.Delete);
        setConfirmation({
            showConfirmation: false,
            data: []
        });
    };
    const onCancelRecords = (items) => {
        var _a;
        (_a = actionsRef.current) === null || _a === void 0 ? void 0 : _a.cancelRecords(items);
    };
    const onSaveRecords = (items) => {
        var _a, _b, _c;
        let errors = 0;
        let columns = (_a = stateRef.current) === null || _a === void 0 ? void 0 : _a.columns;
        columns = (columns === null || columns === void 0 ? void 0 : columns.filter((item) => !(item.readonly || item.key === 'Action'))) || [];
        items &&
            items.forEach((item) => {
                columns &&
                    columns.forEach((column) => {
                        const value = item.updatedData[column.fieldName];
                        if (column.onValidate) {
                            item.updatedData[`${column.fieldName}Error`] = column.onValidate(value, column, item);
                        }
                        else {
                            item.updatedData[`${column.fieldName}Error`] =
                                column.required &&
                                    !(value === 0 || value === false) &&
                                    !value &&
                                    localizedString(COMMON_LOCALIZATION_STRINGS.REQUIRED_FIELD, localization);
                        }
                        errors = errors + item.updatedData[`${column.fieldName}Error`] ? 1 : 0;
                    });
            });
        if (errors > 0) {
            (_b = actionsRef.current) === null || _b === void 0 ? void 0 : _b.changeRecords(items);
            return;
        }
        let status = (_c = actionsRef.current) === null || _c === void 0 ? void 0 : _c.saveRecords(items);
        let isAdd = items.some((i) => i.isNewItem === true);
        status &&
            props.onItemsUpdate &&
            props.onItemsUpdate(items, isAdd ? OperationType.Add : OperationType.Edit);
    };
    const onRecordUpdate = (column, value, item) => {
        var _a;
        item.updatedData = item.updatedData || {};
        item.updatedData[column.fieldName] = value;
        if (column.onValidate) {
            item.updatedData[`${column.fieldName}Error`] = column.onValidate(value, column, item);
        }
        else {
            item.updatedData[`${column.fieldName}Error`] =
                column.required &&
                    !value &&
                    localizedString(COMMON_LOCALIZATION_STRINGS.REQUIRED_FIELD, localization);
        }
        (_a = actionsRef.current) === null || _a === void 0 ? void 0 : _a.changeRecords([item]);
    };
    // #endregion "Render HTML Section"
    // #region "Render HTML Section"
    const getQuickActionSection = () => {
        const itemsToEdit = getItemsToEdit();
        const quickActionSectionParams = {
            gridViewType: props.gridViewType,
            columns: state.columns,
            allowMultiLevelSorting: props.allowMultiLevelSorting,
            sortLevel: props.sortLevel,
            sortingOptions: state.sortingOptions,
            onSort: onSort,
            hideColumnPicker: props.hideColumnPicker,
            onColumnChange,
            showQuickSearch: !props.hideQuickSearch,
            searchText: state.searchText,
            searchPlaceHolderText: props.searchPlaceHolderText,
            quickSearchOnEnter: props.quickSearchOnEnter,
            hideQuickSearchButton: props.hideQuickSearchButton,
            onSearchTextChange,
            showFilters: !props.hideFilters && !!(state.filters && state.filters.length > 0),
            toggleFilters: onToggleFilter,
            onRefresh: props.onRefresh,
            exportOptions: props.exportOptions,
            onExport: props.onExport ? onExport : undefined,
            onEdit: !props.hideBulkEdit && props.allowSelection && itemsToEdit.length === 0 && props.allowEdit
                ? onEdit
                : undefined,
            onSave: props.allowEdit && itemsToEdit.length > 0 ? onSave : undefined,
            onCancel: props.allowEdit && itemsToEdit.length > 0 ? onCancel : undefined,
            onDelete: !props.hideBulkDelete && props.allowSelection && props.allowDelete ? onDelete : undefined,
            selectedItems: state.selectedItems,
            // leftItemsOrder: props.actionBarItemsOrder,
            quickActionSectionItems: props.quickActionSectionItems,
            allowGroupSelection: props.allowGrouping && props.allowGroupSelection,
            groupColumn: state.groupColumn,
            onGroupColumnChange
        };
        if (QuickActionSectionComponent) {
            return _jsx(QuickActionSectionComponent, Object.assign({}, quickActionSectionParams), void 0);
        }
        return (!props.hideQuickActionSection &&
            props.quickActionSectionItems && _jsx(QuickActionSectionDefault, Object.assign({}, quickActionSectionParams), void 0));
    };
    const getMessageSection = () => {
        if (StatusMessageSectionComponent) {
            return (_jsx(StatusMessageSectionComponent, { messages: state.statusMessages, onDissmiss: onDismissMessage }, void 0));
        }
        return (_jsx(StatusMessages, { messages: getUpdatedMessageList(state.statusMessages), onDismiss: onDismissMessage }, void 0));
    };
    const getSelectedFiltersSection = () => {
        if (!state.selectedFilters) {
            return null;
        }
        if (state.selectedFilters.length === 0) {
            return null;
        }
        if (FilterTagsComponent) {
            return (_jsx(FilterTagsComponent, { filters: state.selectedFilters, maxFilterTagLength: props.maxFilterTagLength, onRemoveFilter: onRemoveFilter, onClearFilters: props.hideClearFilters ? undefined : onClearFilters, onChangeFilter: onFilterChange, onApplyFilter: state.gridViewType === GridViewType.ServerSide ? onApplyFilter : undefined }, void 0));
        }
        return (_jsx("div", Object.assign({ className: classes.filterToolbar }, { children: _jsx(FilterTags, { filters: state.selectedFilters, maxFilterTagLength: props.maxFilterTagLength, onRemoveFilter: onRemoveFilter, onClearFilters: props.hideClearFilters ? undefined : onClearFilters, onChangeFilter: onFilterChange, onApplyFilter: state.gridViewType === GridViewType.ServerSide ? onApplyFilter : undefined }, void 0) }), void 0));
    };
    const getGridSummarySection = () => {
        if (props.hideGridSummary)
            return null;
        return getDefaultGridSummary();
    };
    const getDefaultGridSummary = () => {
        var _a, _b, _c, _d;
        const totalCount = state.gridViewType === GridViewType.InMemory
            ? state.filteredItems.length
            : state.totalRecords;
        if (GridSummaryComponent) {
            return (_jsx(GridSummaryComponent, { pageNumber: props.hidePaging ||
                    (props.gridViewType === GridViewType.InMemory && props.allowGrouping)
                    ? undefined
                    : (_a = state.pagingOptions) === null || _a === void 0 ? void 0 : _a.pageNumber, pageSize: (_b = state.pagingOptions) === null || _b === void 0 ? void 0 : _b.pageSize, totalCount: totalCount, selectionCount: state.allowSelection ? (state.selectedItems ? state.selectedItems.length : 0) : 0 }, void 0));
        }
        return (_jsx(GridSummary, { pageNumber: props.hidePaging ||
                (props.gridViewType === GridViewType.InMemory && props.allowGrouping) ||
                props.pagingOptionsWithoutPage
                ? undefined
                : (_c = state.pagingOptions) === null || _c === void 0 ? void 0 : _c.pageNumber, pageSize: (_d = state.pagingOptions) === null || _d === void 0 ? void 0 : _d.pageSize, totalCount: totalCount, selectionCount: state.allowSelection ? (state.selectedItems ? state.selectedItems.length : 0) : 0 }, void 0));
    };
    const getGridAddRecordSection = () => {
        if (!props.allowAdd) {
            return null;
        }
        return (_jsx(CommandBarButton, { className: classes.gridviewAddSection, iconProps: { iconName: 'Add' }, text: localizedString(GRIDVIEW_LOCALIZATION_STRINGS.ADD, localization), onClick: onAddRecord }, void 0));
    };
    const getDeleteConfirmationDialog = () => {
        return (_jsx(Dialog, Object.assign({ hidden: !confirmation.showConfirmation, onDismiss: () => {
                setConfirmation({
                    showConfirmation: false,
                    data: undefined
                });
            }, dialogContentProps: {
                title: localizedString(GRIDVIEW_LOCALIZATION_STRINGS.CONFIRMATION, localization),
                subText: localizedString(GRIDVIEW_LOCALIZATION_STRINGS.CONFIRMATION_MESSAGE, localization)
            }, modalProps: { isBlocking: true } }, { children: _jsxs(DialogFooter, { children: [_jsx(PrimaryButton, { onClick: () => {
                            confirmation.confirmCallback && confirmation.confirmCallback(confirmation.data);
                        }, text: localizedString(COMMON_LOCALIZATION_STRINGS.DELETE, localization) }, void 0), _jsx(DefaultButton, { onClick: () => {
                            setConfirmation({
                                showConfirmation: false,
                                data: undefined
                            });
                        }, text: localizedString(COMMON_LOCALIZATION_STRINGS.CANCEL, localization) }, void 0)] }, void 0) }), void 0));
    };
    const getGridViewSection = () => {
        if (props.showFiltersAside) {
            return (_jsxs("div", Object.assign({ className: classes.fliterGridContainer }, { children: [state.showFilters && (_jsx("div", Object.assign({ className: classes.filtersSection }, { children: getGridViewFilters() }), void 0)), _jsxs("div", Object.assign({ className: state.showFilters ? classes.gridViewWithFilters : classes.gridViewWithoutFilters }, { children: [getGridSummarySection(), getGridViewData(), getNoResultsSection(), getGridAddRecordSection(), getPager(), getDeleteConfirmationDialog()] }), void 0)] }), void 0));
        }
        else {
            return (_jsxs("div", Object.assign({ className: classes.gridViewData }, { children: [getGridViewFilterAsSidePanel(), getGridSummarySection(), getGridViewData(), getNoResultsSection(), getGridAddRecordSection(), getPager(), getDeleteConfirmationDialog()] }), void 0));
        }
    };
    const renderSaveRecordActionButtons = (item, column) => {
        return (!props.hideInlineEdit && (_jsxs(_Fragment, { children: [_jsx(CommandBarButton, { className: classes.gridviewActionColumnButton, iconProps: { iconName: 'Save' }, text: localizedString(COMMON_LOCALIZATION_STRINGS.SAVE, localization), onClick: () => {
                        onSaveRecords([item]);
                    } }, void 0), _jsx(CommandBarButton, { className: classes.gridviewActionColumnButton, iconProps: { iconName: 'Cancel' }, text: localizedString(COMMON_LOCALIZATION_STRINGS.CANCEL, localization), onClick: () => {
                        onCancelRecords([item]);
                    } }, void 0)] }, void 0)));
    };
    const renderAsTextBox = (controlValue, item, column) => {
        return (_jsx(TextField, { value: controlValue, errorMessage: item.updatedData[`${column.fieldName}Error`], onChange: (e, value) => onRecordUpdate(column, value || '', item) }, void 0));
    };
    const renderAsComboBox = (controlValue, item, column) => {
        return (_jsx(ComboBox, { options: column.editControlOptions || [], defaultSelectedKey: controlValue, onChange: (event, option) => {
                onRecordUpdate(column, option.key, item);
            }, errorMessage: item.updatedData[`${column.fieldName}Error`] }, void 0));
    };
    const renderAsDatePicker = (controlValue, item, column) => {
        const date = controlValue ? new Date(controlValue) : undefined;
        return (_jsx(DatePicker, { firstDayOfWeek: DayOfWeek.Sunday, ariaLabel: localizedString(GRIDVIEW_LOCALIZATION_STRINGS.SELECT_DATE, localization), value: date, isRequired: column.required, onSelectDate: (date) => {
                onRecordUpdate(column, date || '', item);
            } }, void 0));
    };
    const renderAsCustom = (controlValue, item, column) => {
        return column.onRenderEditControl
            ? column.onRenderEditControl(item, onRecordUpdate, column)
            : renderAsLabel(controlValue, item, column);
    };
    const renderAsLabel = (controlValue, item, column) => {
        return _jsx("span", { children: controlValue }, void 0);
    };
    const renderEditableRow = (item, column) => {
        let value = item.updatedData[column.fieldName];
        value = value === 0 || value === false ? value : value || '';
        if (column.formatValue) {
            value = column.formatValue(value, item);
        }
        if (column.readonly) {
            return renderAsLabel(value, item, column);
        }
        else if (column.editControlType === ControlType.TextBox) {
            return renderAsTextBox(value, item, column);
        }
        else if (column.editControlType === ControlType.ComboBox) {
            return renderAsComboBox(value, item, column);
        }
        else if (column.editControlType === ControlType.DatePicker) {
            return renderAsDatePicker(value, item, column);
        }
        else if (column.editControlType === ControlType.Custom) {
            return renderAsCustom(value, item, column);
        }
        else {
            return renderAsTextBox(value, item, column);
        }
    };
    const renderColumnInUpdateMode = (item, column) => {
        if (column.key === 'Action') {
            return renderSaveRecordActionButtons(item, column);
        }
        else {
            return renderEditableRow(item, column);
        }
    };
    const renderEditButton = (item) => {
        if (!props.allowEdit) {
            return null;
        }
        else {
            return (_jsx(CommandBarButton, { className: classes.gridviewActionColumnButton, iconProps: { iconName: 'Edit' }, text: localizedString(COMMON_LOCALIZATION_STRINGS.EDIT, localization), onClick: () => {
                    onEditRecords([item]);
                } }, void 0));
        }
    };
    const renderDeleteButton = (item) => {
        if (!props.allowDelete) {
            return null;
        }
        else {
            return (_jsx(CommandBarButton, { className: classes.gridviewActionColumnButton, iconProps: { iconName: 'Delete' }, text: localizedString(COMMON_LOCALIZATION_STRINGS.DELETE, localization), onClick: () => {
                    setConfirmation({
                        showConfirmation: true,
                        data: [item],
                        confirmCallback: onDeleteRecords
                    });
                } }, void 0));
        }
    };
    const renderActionColumn = () => {
        const actionColumn = {
            key: 'Action',
            name: 'Action',
            fieldName: 'Action',
            minWidth: 210,
            maxWidth: 210,
            isRowHeader: true,
            isResizable: false,
            columnActionsMode: ColumnActionsMode.disabled,
            required: true,
            selected: true,
            onRender: (item) => {
                return (_jsxs(Stack, Object.assign({ horizontal: true }, { children: [!props.hideInlineEdit && renderEditButton(item), !props.hideInlineDelete && renderDeleteButton(item)] }), void 0));
            }
        };
        actionColumn.onRenderBackup = actionColumn.onRender;
        return actionColumn;
    };
    const getUpdatedColumns = (columnsData) => {
        let columns = columnsData;
        if ((props.allowAdd || props.allowEdit || props.allowDelete) &&
            !columns.filter((col) => col.key === 'Action').length) {
            columns.push(renderActionColumn());
        }
        const itemsToUpdate = getItemsToEdit();
        if (!(itemsToUpdate.length || props.highLightSearchText)) {
            return columns;
        }
        columns.forEach((column) => {
            column.onRender = (item, index, col) => {
                if (item.isDirty) {
                    return renderColumnInUpdateMode(item, column);
                }
                else if (column === null || column === void 0 ? void 0 : column.onRenderBackup) {
                    return column === null || column === void 0 ? void 0 : column.onRenderBackup(item, index, col);
                }
                else {
                    let value = item[column.fieldName];
                    value = value === 0 || value === false ? value : value || '';
                    return props.highLightSearchText ? (_jsx(HighlightText, { text: value.toString(), textToBeHighlighted: stateRef.current.searchText || '' }, void 0)) : (_jsxs(_Fragment, { children: [value.toString(), " "] }, void 0));
                }
            };
        });
        return columns;
    };
    const getGridViewData = () => {
        const items = getItems();
        const columns = getUpdatedColumns(state.columns);
        const gridViewDataClass = props.gridDataClass
            ? mergeClassNames([classes.gridViewData, props.gridDataClass])
            : classes.gridViewData;
        if (GridComponent) {
            return (_jsx("div", Object.assign({ className: items.length ? gridViewDataClass : classes.gridViewNoData }, { children: _jsx(GridComponent, Object.assign({}, props, { items: items || [], columns: columns, selection: props.allowSelection ? selection : undefined, groups: props.allowGrouping ? props.groups || state.groups : undefined }), void 0) }), void 0));
        }
        if (CardComponent) {
            return (_jsx("div", Object.assign({ className: items.length ? gridViewDataClass : classes.gridViewNoData }, { children: props.items.map((item, index) => {
                    const cardProps = Object.assign(Object.assign({}, props), { item });
                    return _jsx(CardComponent, Object.assign({}, cardProps), index);
                }) }), void 0));
        }
        return (_jsx("div", Object.assign({ className: items.length ? gridViewDataClass : classes.gridViewNoData }, { children: _jsx(GridViewDefault, Object.assign({}, props, { items: items || [], columns: columns || [], selection: props.allowSelection ? selection : undefined, groups: props.allowGrouping ? props.groups || state.groups : undefined }), void 0) }), void 0));
    };
    const getGridViewFilters = () => {
        if (!state.showFilters) {
            return null;
        }
        const filters = props.gridViewType === GridViewType.InMemory ? state.filters : state.availableFilters;
        if (SideFilterComponent) {
            return (_jsx("aside", { children: _jsx(SideFilterComponent, { showFilters: state.showFilters, toggleFilters: onToggleFilter, filters: filters, onFilterChange: onFilterChange, onApplyFilters: state.gridViewType === GridViewType.ServerSide ? onApplyFilters : undefined }, void 0) }, void 0));
        }
        return (_jsxs("aside", { children: [_jsx("div", Object.assign({ className: classes.filtersHeader }, { children: "Filters" }), void 0), _jsx(GridFilters, { filters: state.filters || [], onFilterChange: onFilterChange }, void 0)] }, void 0));
    };
    const getGridViewFilterAsSidePanel = () => {
        const filters = props.gridViewType === GridViewType.InMemory ? state.filters : state.availableFilters;
        if (SideFilterComponent) {
            return (_jsx(SideFilterComponent, { showFilters: state.showFilters, toggleFilters: onToggleFilter, filters: filters, onFilterChange: onFilterChange, onApplyFilters: state.gridViewType === GridViewType.ServerSide ? onApplyFilters : undefined }, void 0));
        }
        return (_jsx(GridFilterPanel, { showFilters: state.showFilters === true, toggleFilters: onToggleFilter, filters: filters, onFilterChange: onFilterChange, onApplyFilters: state.gridViewType === GridViewType.ServerSide ? onApplyFilters : undefined }, void 0));
    };
    const getNoResultsSection = () => {
        const totalCount = state.gridViewType === GridViewType.InMemory
            ? state.filteredItems.length
            : state.totalRecords;
        if (totalCount !== 0) {
            return null;
        }
        if (NoResultsComponent) {
            return (_jsx(Stack, { children: _jsx(StackItem, Object.assign({ align: "center" }, { children: _jsx(NoResultsComponent, { totalRecords: totalCount }, void 0) }), void 0) }, void 0));
        }
        return (_jsxs(Stack, { children: [_jsx(StackItem, Object.assign({ align: "center" }, { children: _jsx(Icon, { iconName: "Search", className: classes.noResultsIcon }, void 0) }), void 0), _jsx(StackItem, Object.assign({ align: "center" }, { children: _jsx("div", Object.assign({ className: classes.noResults }, { children: "No Items" }), void 0) }), void 0)] }, void 0));
    };
    const getPager = () => {
        var _a, _b, _c, _d;
        if (props.hidePaging ||
            props.allowAdd ||
            (props.gridViewType === GridViewType.InMemory && props.allowGrouping))
            return null;
        const totalCount = state.gridViewType === GridViewType.InMemory
            ? state.filteredItems.length
            : state.totalRecords;
        if (PagerComponent) {
            return (_jsx(PagerComponent, { pageNumber: (_a = state.pagingOptions) === null || _a === void 0 ? void 0 : _a.pageNumber, pageSize: (_b = state.pagingOptions) === null || _b === void 0 ? void 0 : _b.pageSize, totalCount: totalCount, onPaginationChange: onPaginationChange }, void 0));
        }
        return (_jsx("div", Object.assign({ className: classes.gridViewPager }, { children: props.pagingOptionsWithoutPage && state.gridViewType === GridViewType.ServerSide ? (_jsx(PaginationWithoutPages, { onPageChange: onPageChangeWithoutPages, isPreviousAllowed: props.pagingOptionsWithoutPage.isPreviousAllowed, isNextAllowed: props.pagingOptionsWithoutPage.isNextAllowed }, void 0)) : (_jsx(Pagination, { pageNumber: (_c = state.pagingOptions) === null || _c === void 0 ? void 0 : _c.pageNumber, pageSize: (_d = state.pagingOptions) === null || _d === void 0 ? void 0 : _d.pageSize, totalCount: totalCount, onPaginationChange: onPaginationChange }, void 0)) }), void 0));
    };
    const getGridShimmer = () => {
        const items = [];
        items.push(_jsx(Shimmer, { className: "shimmerClass", shimmerColors: {
                shimmerWave: 'lightgrey'
            }, shimmerElements: [
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '98%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                }
            ], width: "100%" }, 0));
        for (let i = 0; i < 15; i++) {
            items.push(_jsx(Shimmer, { className: "shimmerClass", shimmerColors: {
                    shimmerWave: 'lightgrey'
                }, shimmerElements: [
                    {
                        height: 25,
                        type: ShimmerElementType.circle,
                        width: '5%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.line,
                        width: '10%'
                    },
                    {
                        height: 25,
                        type: ShimmerElementType.gap,
                        width: '2%'
                    }
                ], width: "100%" }, i + 1));
        }
        items.push(_jsx(Shimmer, { className: "shimmerClass", shimmerColors: {
                shimmerWave: 'lightgrey'
            }, shimmerElements: [
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '17%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '67%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.line,
                    width: '14%'
                },
                {
                    height: 25,
                    type: ShimmerElementType.gap,
                    width: '2%'
                }
            ], width: "100%" }, 20));
        return _jsx("div", Object.assign({ className: classes.loadingSection }, { children: items }), void 0);
    };
    const mergeClassNames = (classNames) => classNames.filter((className) => !!className).join(' ');
    const gridContainerClass = props.gridContainerClass
        ? mergeClassNames([classes.gridView, props.gridContainerClass])
        : classes.gridView;
    if (!(state && state.gridViewType >= 0))
        return null;
    return (_jsx(GridViewContext.Provider, Object.assign({ value: { state, actions } }, { children: _jsxs("div", Object.assign({ className: gridContainerClass }, { children: [_jsxs("div", Object.assign({ className: classes.gridViewtopSection }, { children: [getQuickActionSection(), getMessageSection(), getSelectedFiltersSection()] }), void 0), props.isLoading ? getGridShimmer() : _jsx(_Fragment, { children: getGridViewSection() }, void 0)] }), void 0) }), void 0));
    // #endregion "HTML Section"
};
