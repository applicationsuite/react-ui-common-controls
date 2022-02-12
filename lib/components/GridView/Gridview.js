import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Stack, StackItem, Icon, ShimmerElementType, mergeStyles, Shimmer } from '@fluentui/react';
import { HighlightText, SORT_TYPE, Pagination, PaginationWithoutPages } from '../../';
import { cloneDeep } from 'lodash';
import { GridViewType, GridViewChangeType, DEFAULT_MESSAGE_DISMISS_TIME } from './GridView.models';
import { GridViewDefault } from './GridViewDefault';
import { useInit, getFilteredSelectedItems, getUpdateFilters } from './GridView.hooks';
import { QuickActionSection as QuickActionSectionDefault } from './QuickActionSection';
import { FilterTags } from './FilterTag';
import { GridFilterPanel, GridFilters } from './GridFilters';
import { StatusMessages } from './StatusMessage';
import { GridSummary } from './GridSummary';
import { gridViewStyles } from './GridView.styles';
import { GridViewContext } from './GridView.context';
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
    const stateRef = React.useRef();
    const actionsRef = React.useRef();
    stateRef.current = state;
    actionsRef.current = actions;
    React.useEffect(() => {
        updateMessageList(props.statusMessages);
    }, [props.statusMessages]);
    // #endregion "State initialization"
    // #region "Event Handler Section"
    function onSelectionChange() {
        const currentActions = actionsRef.current;
        currentActions.applySelectedItems(selection.getSelection());
        if (!isInitialLoad) {
            props.onHandleChange &&
                props.onHandleChange(getSelections(GridViewChangeType.SelectedItems, selection.getSelection()), GridViewChangeType.SelectedItems);
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
        const items = props.hidePaging || props.allowGrouping
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
    const onRowItemClick = (column, item) => {
        props.onGridRowItemClick && props.onGridRowItemClick(column, item);
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
        var _a;
        const selections = getSelections();
        props.onEdit && props.onEdit(((_a = selections.selectedItems) === null || _a === void 0 ? void 0 : _a.length) && selections.selectedItems[0]);
    };
    const onDelete = () => {
        const selections = getSelections();
        props.onDelete && props.onDelete(selections.selectedItems);
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
    // #endregion "Render HTML Section"
    // #region "Render HTML Section"
    const getQuickActionSection = () => {
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
            onEdit: props.onEdit ? onEdit : undefined,
            onDelete: props.onDelete ? onDelete : undefined,
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
    const getGridViewSection = () => {
        if (props.showFiltersAside) {
            return (_jsxs("div", Object.assign({ className: classes.fliterGridContainer }, { children: [state.showFilters && (_jsx("div", Object.assign({ className: classes.filtersSection }, { children: getGridViewFilters() }), void 0)), _jsxs("div", Object.assign({ className: state.showFilters ? classes.gridViewWithFilters : classes.gridViewWithoutFilters }, { children: [getGridSummarySection(), getGridViewData(), getNoResultsSection(), getPager()] }), void 0)] }), void 0));
        }
        else {
            return (_jsxs("div", Object.assign({ className: classes.gridViewData }, { children: [getGridViewFilterAsSidePanel(), getGridSummarySection(), getGridViewData(), getNoResultsSection(), getPager()] }), void 0));
        }
    };
    const getHighLightedColumns = (columns) => {
        let searchableColumns = columns.filter((col) => col.searchable === true && !col.onRender);
        searchableColumns.forEach((column) => {
            column.onRender =
                column.onRender ||
                    ((item) => {
                        let value = item[column.fieldName];
                        value = value === 0 ? value : value || '';
                        return (_jsx(HighlightText, { text: value.toString(), textToBeHighlighted: stateRef.current.searchText || '' }, void 0));
                    });
        });
        return columns;
    };
    const getGridViewData = () => {
        const items = getItems();
        const columns = state.columns
            ? props.highLightSearchText
                ? getHighLightedColumns(state.columns)
                : state.columns
            : [];
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
        return (_jsx("div", Object.assign({ className: items.length ? gridViewDataClass : classes.gridViewNoData }, { children: _jsx(GridViewDefault, Object.assign({}, props, { items: items || [], columns: columns, selection: props.allowSelection ? selection : undefined, groups: props.allowGrouping ? props.groups || state.groups : undefined }), void 0) }), void 0));
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
        if (props.hidePaging || (props.gridViewType === GridViewType.InMemory && props.allowGrouping))
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
        const wrapperClass = mergeStyles({
            padding: 2,
            selectors: {
                '& > .ms-Shimmer-container': {
                    margin: '10px 0'
                }
            }
        });
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
        return _jsx("div", Object.assign({ className: wrapperClass }, { children: items }), void 0);
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
