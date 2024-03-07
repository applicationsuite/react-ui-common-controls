import { useEffect, useReducer, useMemo } from 'react';
import { ColumnActionsMode, Selection } from '@fluentui/react/lib/DetailsList';
import { gridViewReducer } from './GridView.reducers';
import { GRIDVIEW_ACTIONS } from './GridView.actions';
import { GridViewType, FilterType, FilterOperation, FILTER_ITEM_TEXT_FIELD } from './GridView.models';
import { applyPaging, applySorting as applySortingDefault } from '../../utilities';
import { DEFAULT_PAGE_SIZE, SORT_TYPE } from '../../constants';
import { applyFilterTextByField, getFieldFilterItems, applyFiltersByFieldName, mergeItems, getGridViewGroupsByColumns } from './GridViewUtils';
import { cloneDeep } from 'lodash';
export const useInit = (props, callbacks) => {
    const [state, dispatch] = useReducer(gridViewReducer, {});
    const selection = useSelection(props, callbacks.onSelectionChange, state);
    const actions = gridViewActions(dispatch, state);
    useEffect(() => {
        actions.initialize(props, callbacks);
        props.allowSelection && updateSelections(props, selection);
    }, [props.items]);
    return { state: state, actions, selection };
};
export const useSelection = (props, handleSelectionChange, state) => {
    const selection = useMemo(() => {
        if (!props.allowSelection) {
            return new Selection();
        }
        const filteredItems = props.selectFirstItemOnLoad ? getFilterData(props) : props.items;
        let firstLoad = state.items && state.items.length !== props.items.length;
        return new Selection({
            onSelectionChanged: () => {
                !firstLoad && handleSelectionChange(selection);
                firstLoad = false;
            },
            items: filteredItems
        });
    }, [props.items]);
    return selection;
};
const gridViewActions = (dispatch, state) => {
    const actions = {
        initialize: (props, callbacks) => {
            var _a;
            const pagingOptions = getPagingOptions(props.pagingOptions);
            const sortingOptions = props.sortingOptions && props.sortingOptions.length ? props.sortingOptions[0] : undefined;
            const initialData = {
                gridViewType: props.gridViewType,
                items: props.items,
                filteredItems: props.items,
                filters: props.filters || [],
                searchFields: props.searchFields,
                itemUniqueField: props.itemUniqueField,
                totalRecords: props.totalRecords || props.totalRecords === 0 ? props.totalRecords : props.items.length,
                columns: updateColumns(props.columns, state.columns || [], sortingOptions, callbacks.onColumnClick, props.removeSorting || props.allowMultiLevelSorting),
                allowGrouping: props.allowGrouping || (props.groups && props.groups.length > 0),
                allowGroupSelection: props.allowGroupSelection,
                allowSelection: props.allowSelection,
                statusMessages: state.statusMessages ? state.statusMessages : [],
                filtersToApply: [],
                availableFilters: [],
                showFilters: props.showFiltersOnLoad,
                hidePaging: props.hidePaging
            };
            let filteredItems = [...props.items];
            if (props.gridViewType === GridViewType.InMemory) {
                // Applying Filters
                filteredItems = applyFilters(props.selectedFilters, filteredItems);
                // update the search Fields
                if (!props.searchFields) {
                    initialData.searchFields = getSearchFieldsFromColumns(initialData.columns);
                }
                // Applying Filter Text
                filteredItems = applySearchText(props.searchText, filteredItems, props.searchFields, props.itemUniqueField);
                // Applying sort
                filteredItems = applySorting(filteredItems, sortingOptions);
                initialData.filteredItems = filteredItems;
                // Applying Paging
                initialData.paginatedFilteredItems = applyPaging(pagingOptions.pageSize, pagingOptions.pageNumber, filteredItems);
            }
            if (!props.hideFilters) {
                // update the filters
                if (!props.filters) {
                    initialData.filters = getFiltersFromColumns(initialData.columns, filteredItems, props.gridViewType);
                }
                initialData.filters = getUpdateFilters(initialData.filters, props.selectedFilters, filteredItems);
            }
            // Create Groups
            if (initialData.allowGrouping) {
                const groupColumns = (_a = initialData.columns) === null || _a === void 0 ? void 0 : _a.filter((col) => col.grouping === true);
                const groupColumn = props.groupBy
                    ? groupColumns === null || groupColumns === void 0 ? void 0 : groupColumns.find((col) => col.key === props.groupBy)
                    : undefined;
                initialData.groupColumn = groupColumn;
                const groupedData = getGridViewGroupsByColumns(initialData.columns, initialData.filteredItems, groupColumn, props.allowGroupSelection);
                initialData.groups = groupedData.groups;
                initialData.filteredItems = groupedData.items;
            }
            initialData.pagingOptions = pagingOptions;
            initialData.sortingOptions = props.sortingOptions;
            initialData.selectedFilters = props.selectedFilters || [];
            initialData.selectedItems = getFilteredSelectedItems(props.items, props.selectedItems, props.itemUniqueField);
            initialData.searchText = props.searchText;
            dispatch({ type: GRIDVIEW_ACTIONS.INITIALIZE, data: initialData });
        },
        applyPaging: (items, pagingOptions) => {
            if (state.gridViewType === GridViewType.InMemory) {
                let filteredItems = [...items];
                filteredItems = applyPaging(pagingOptions.pageSize, pagingOptions.pageNumber, items);
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
                    data: filteredItems
                });
            }
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_PAGING_OPTIONS,
                data: pagingOptions
            });
        },
        applySorting: (items, sortingOptions, columns) => {
            var _a, _b;
            if (state.gridViewType === GridViewType.InMemory) {
                // Apply Sorting
                let filteredItems = [...items];
                const sortingOption = sortingOptions && sortingOptions.length ? sortingOptions[0] : undefined;
                filteredItems = applySorting(filteredItems, sortingOption);
                // Create Groups
                if (state.allowGrouping) {
                    const groupedData = getGridViewGroupsByColumns(state.columns, filteredItems, state.groupColumn, state.allowGroupSelection);
                    filteredItems = groupedData.items;
                    dispatch({
                        type: GRIDVIEW_ACTIONS.SET_GROUPS,
                        data: groupedData.groups
                    });
                }
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_FILTER_ITEMS,
                    data: filteredItems
                });
                // Apply Paging
                const pagingOptions = (_a = state.pagingOptions) !== null && _a !== void 0 ? _a : getPagingOptions();
                const paginatedFilteredItems = applyPaging(pagingOptions.pageSize, 1, filteredItems);
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
                    data: paginatedFilteredItems
                });
            }
            const pagingOptions = (_b = state.pagingOptions) !== null && _b !== void 0 ? _b : getPagingOptions();
            pagingOptions.pageNumber = 1;
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_PAGING_OPTIONS,
                data: pagingOptions
            });
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_SORT_OPTIONS,
                data: sortingOptions
            });
            dispatch({ type: GRIDVIEW_ACTIONS.SET_COLUMNS, data: columns });
        },
        applyFilters: (items, selectedFilters) => {
            var _a, _b;
            if (state.gridViewType === GridViewType.InMemory) {
                let filteredItems = [...items];
                // Applying Filter Text
                filteredItems = applySearchText(state.searchText, filteredItems, state.searchFields, state.itemUniqueField);
                // Applying Filters
                if (selectedFilters.length === 1) {
                    selectedFilters[0].isCurrent = true;
                }
                const filtersToInclude = selectedFilters.filter((filter) => filter.isCurrent !== true);
                const filterItemsWithIncludeFilters = applyFilters(filtersToInclude, [...filteredItems]);
                filteredItems = applyFilters(selectedFilters, filteredItems);
                // update the filters
                if (state.filters && state.filters.length > 0) {
                    const filters = getUpdateFilters(state.filters, selectedFilters, filteredItems, filterItemsWithIncludeFilters);
                    dispatch({
                        type: GRIDVIEW_ACTIONS.SET_FILTERS,
                        data: filters
                    });
                }
                // Applying sort
                const sortingOptions = state.sortingOptions && state.sortingOptions.length
                    ? state.sortingOptions[0]
                    : undefined;
                filteredItems = applySorting(filteredItems, sortingOptions);
                // Create Groups
                if (state.allowGrouping) {
                    const groupedData = getGridViewGroupsByColumns(state.columns, filteredItems, state.groupColumn, state.allowGroupSelection);
                    filteredItems = groupedData.items;
                    dispatch({
                        type: GRIDVIEW_ACTIONS.SET_GROUPS,
                        data: groupedData.groups
                    });
                }
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_FILTER_ITEMS,
                    data: filteredItems
                });
                // Apply Paging
                const pagingOptions = (_a = state.pagingOptions) !== null && _a !== void 0 ? _a : getPagingOptions();
                const paginatedFilteredItems = applyPaging(pagingOptions.pageSize, 1, filteredItems);
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
                    data: paginatedFilteredItems
                });
            }
            else if (state.filters && state.filters.length > 0) {
                const filters = getUpdateFilters(state.filters, selectedFilters, [], undefined, false);
                dispatch({ type: GRIDVIEW_ACTIONS.SET_FILTERS, data: filters });
            }
            const pagingOptions = (_b = state.pagingOptions) !== null && _b !== void 0 ? _b : getPagingOptions();
            pagingOptions.pageNumber = 1;
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_PAGING_OPTIONS,
                data: pagingOptions
            });
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_SELECTED_FILTERS,
                data: selectedFilters
            });
        },
        applyFilterText: (items, filterText) => {
            var _a, _b;
            if (state.gridViewType === GridViewType.InMemory) {
                let filteredItems = [...items];
                // Applying Filters
                filteredItems = applyFilters(state.selectedFilters, filteredItems);
                // Applying Filter Text
                filteredItems = applySearchText(filterText, filteredItems, state.searchFields, state.itemUniqueField);
                // update the filters
                if (state.filters && state.filters.length > 0) {
                    const filters = getUpdateFilters(state.filters, state.selectedFilters, filteredItems);
                    dispatch({
                        type: GRIDVIEW_ACTIONS.SET_FILTERS,
                        data: filters
                    });
                }
                // Apply Sorting
                const sortingOptions = state.sortingOptions && state.sortingOptions.length
                    ? state.sortingOptions[0]
                    : undefined;
                filteredItems = applySorting(filteredItems, sortingOptions);
                // Create Groups
                if (state.allowGrouping) {
                    const groupedData = getGridViewGroupsByColumns(state.columns, filteredItems, state.groupColumn, state.allowGroupSelection);
                    filteredItems = groupedData.items;
                    dispatch({
                        type: GRIDVIEW_ACTIONS.SET_GROUPS,
                        data: groupedData.groups
                    });
                }
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_FILTER_ITEMS,
                    data: filteredItems
                });
                // Apply Paging
                const pagingOptions = (_a = state.pagingOptions) !== null && _a !== void 0 ? _a : getPagingOptions();
                const paginatedFilteredItems = applyPaging(pagingOptions.pageSize, 1, filteredItems);
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
                    data: paginatedFilteredItems
                });
            }
            const pagingOptions = (_b = state.pagingOptions) !== null && _b !== void 0 ? _b : getPagingOptions();
            pagingOptions.pageNumber = 1;
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_PAGING_OPTIONS,
                data: pagingOptions
            });
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_SEARCH_TEXT,
                data: filterText
            });
        },
        applyGrouping: (column) => {
            if (state.gridViewType === GridViewType.InMemory) {
                let filteredItems = [...state.items];
                // Applying Filters
                filteredItems = applyFilters(state.selectedFilters, filteredItems);
                // Applying Filter Text
                filteredItems = applySearchText(state.searchText, filteredItems, state.searchFields, state.itemUniqueField);
                // update the filters
                if (state.filters && state.filters.length > 0) {
                    const filters = getUpdateFilters(state.filters, state.selectedFilters, filteredItems);
                    dispatch({
                        type: GRIDVIEW_ACTIONS.SET_FILTERS,
                        data: filters
                    });
                }
                // Apply Sorting
                const sortingOptions = state.sortingOptions && state.sortingOptions.length
                    ? state.sortingOptions[0]
                    : undefined;
                filteredItems = applySorting(filteredItems, sortingOptions);
                // Create Groups
                if (state.allowGrouping) {
                    const groupedData = getGridViewGroupsByColumns(state.columns, filteredItems, column, state.allowGroupSelection);
                    filteredItems = groupedData.items;
                    dispatch({
                        type: GRIDVIEW_ACTIONS.SET_GROUPS,
                        data: column ? groupedData.groups : undefined
                    });
                }
                dispatch({
                    type: GRIDVIEW_ACTIONS.SET_FILTER_ITEMS,
                    data: filteredItems
                });
            }
            dispatch({ type: GRIDVIEW_ACTIONS.SET_GROUP_COLUMN, data: column });
        },
        applySelectedItems: (selectedItems) => {
            const selected = [];
            selectedItems.forEach((item) => {
                if (!selected.find((i) => i[state.itemUniqueField] === item[state.itemUniqueField])) {
                    selected.push(item);
                }
            });
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_SELECTED_ITEMS,
                data: selected
            });
        },
        applySelectedColumns: (selectedColumns) => {
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_COLUMNS,
                data: selectedColumns
            });
        },
        setData: (data) => {
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_DATA,
                data: data
            });
        },
        addRecord: () => {
            let items = getItems(state);
            let newItem = {
                [state.itemUniqueField]: new Date().getUTCMilliseconds().toString(),
                isDirty: true,
                isNewItem: true,
                updatedData: {}
            };
            newItem.updatedData[state.itemUniqueField] = newItem[state.itemUniqueField];
            items = items || [];
            items.push(newItem);
            dispatch({
                type: getActionTypeForItems(state),
                data: items
            });
        },
        editRecords: (itemsToEdit) => {
            let items = cloneDeep(getItems(state));
            itemsToEdit.forEach((item) => {
                let index = items.findIndex((i) => i[state.itemUniqueField] === item[state.itemUniqueField]);
                if (index >= 0) {
                    items[index].updatedData = Object.assign({}, items[index]);
                    items[index].isDirty = true;
                }
            });
            dispatch({
                type: getActionTypeForItems(state),
                data: items
            });
        },
        changeRecords: (itemsToUpdate) => {
            let items = getItems(state);
            itemsToUpdate.forEach((item) => {
                let index = items.findIndex((i) => i[state.itemUniqueField] === item[state.itemUniqueField]);
                if (index >= 0) {
                    items[index].updatedData = item.updatedData;
                }
            });
            dispatch({
                type: getActionTypeForItems(state),
                data: items
            });
        },
        cancelRecords: (itemsToCancel) => {
            let items = getItems(state);
            itemsToCancel.forEach((item) => {
                let index = items.findIndex((i) => i[state.itemUniqueField] === item[state.itemUniqueField]);
                if (index >= 0) {
                    if (item.isNewItem) {
                        items.splice(index, 1);
                    }
                    else {
                        items[index].isDirty = false;
                    }
                }
            });
            dispatch({
                type: getActionTypeForItems(state),
                data: items
            });
        },
        saveRecords: (itemsToSave) => {
            let items = state.items;
            itemsToSave.forEach((item) => {
                let index = items.findIndex((i) => i[state.itemUniqueField] === item[state.itemUniqueField]);
                if (item.isNewItem && index < 0) {
                    let updatedTtem = Object.assign({}, item.updatedData);
                    updatedTtem.isDirty = false;
                    updatedTtem.isNewItem = false;
                    items.push(updatedTtem);
                }
                else if (index >= 0) {
                    items[index] = Object.assign({}, item.updatedData);
                    items[index].isDirty = false;
                    items[index].isNewItem = false;
                }
            });
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_ITEMS,
                data: items
            });
            updateItems(items, state, dispatch);
            return true;
        },
        deleteRecords: (itemsToDelete) => {
            let items = state.items;
            items = items.filter((item) => !itemsToDelete.some((i) => i[state.itemUniqueField] === item[state.itemUniqueField]));
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_ITEMS,
                data: items
            });
            updateItems(items, state, dispatch);
            return true;
        }
    };
    return actions;
};
const updateItems = (items, state, dispatch) => {
    var _a, _b;
    if (state.gridViewType === GridViewType.InMemory) {
        let filteredItems = [...items];
        // Applying Filter Text
        filteredItems = applySearchText(state.searchText, filteredItems, state.searchFields, state.itemUniqueField);
        filteredItems = applyFilters(state.selectedFilters, filteredItems);
        // Applying sort
        const sortingOptions = state.sortingOptions && state.sortingOptions.length ? state.sortingOptions[0] : undefined;
        filteredItems = applySorting(filteredItems, sortingOptions);
        // Create Groups
        if (state.allowGrouping) {
            const groupedData = getGridViewGroupsByColumns(state.columns, filteredItems, state.groupColumn, state.allowGroupSelection);
            filteredItems = groupedData.items;
            dispatch({
                type: GRIDVIEW_ACTIONS.SET_GROUPS,
                data: groupedData.groups
            });
        }
        dispatch({
            type: GRIDVIEW_ACTIONS.SET_FILTER_ITEMS,
            data: filteredItems
        });
        // Apply Paging
        const pagingOptions = (_a = state.pagingOptions) !== null && _a !== void 0 ? _a : getPagingOptions();
        const paginatedFilteredItems = applyPaging(pagingOptions.pageSize, 1, filteredItems);
        dispatch({
            type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
            data: paginatedFilteredItems
        });
    }
    const pagingOptions = (_b = state.pagingOptions) !== null && _b !== void 0 ? _b : getPagingOptions();
    pagingOptions.pageNumber = 1;
    dispatch({
        type: GRIDVIEW_ACTIONS.SET_PAGING_OPTIONS,
        data: pagingOptions
    });
};
const applyFilters = (filters, items) => {
    if (!filters) {
        return items;
    }
    let filteredItems = items;
    filters.forEach((filter) => {
        filteredItems = filter.applyFilter ? filter.applyFilter(filter, filteredItems) : filteredItems;
    });
    return filteredItems;
};
const applyFilterWithItems = (filter, items) => applyFiltersByFieldName(filter.values, items, filter.fieldName);
const applyRangeFilter = (filter, items) => applyFiltersByFieldName(filter.values, items, filter.fieldName, filter.dataType, filter.operation);
const applySearchText = (searchText, items, searchFields, itemUniqueField) => {
    if (!searchFields || !searchText) {
        return items;
    }
    let itemList = items;
    if (searchFields && searchFields.length > 0) {
        const filteredItems = [];
        searchFields.forEach((searchField) => {
            const filteredData = searchField.applySearchText
                ? searchField.applySearchText(searchText, itemList)
                : applyFilterTextByField(searchText, itemList, searchField.fieldName);
            filteredItems.push(filteredData);
        });
        itemList = itemUniqueField ? mergeItems(filteredItems, itemUniqueField) : filteredItems[0];
    }
    return itemList;
};
const applySorting = (items, sortingOptions) => {
    if (!sortingOptions) {
        return items;
    }
    if (!sortingOptions.sortColumn) {
        return items;
    }
    let sortedItems = items;
    sortedItems = sortingOptions.applySorting
        ? sortingOptions.applySorting(sortedItems, sortingOptions)
        : applySortingDefault(sortedItems, sortingOptions.sortField, sortingOptions.sortType);
    return sortedItems;
};
export const getUpdateFilters = (gridFilters, selectedFilters, items, oldItems, isInMemory = true) => {
    const filters = gridFilters || [];
    filters.forEach((filter) => {
        var _a;
        filter.isCurrent = false;
        filter.data = {};
        filter.values = [];
        filter.items = (_a = filter.items) === null || _a === void 0 ? void 0 : _a.map((item) => {
            item.selected = false;
            return item;
        });
        if (selectedFilters && selectedFilters.length > 0) {
            const selected = selectedFilters.find((selectedFilter) => selectedFilter.id === filter.id);
            if (selected) {
                filter.values = selected.values;
                filter.items = selected.items;
                filter.isCurrent = selected.isCurrent;
                filter.operation = selected.operation;
                filter.data = selected.data && selected.data;
            }
        }
        if (isInMemory &&
            (filter.filterType === FilterType.SelectionFilter ||
                filter.filterType === FilterType.ToggleFilter)) {
            populateFilterItems(filter, items, oldItems);
        }
        filter.items = applySortingDefault(filter.items || [], FILTER_ITEM_TEXT_FIELD, SORT_TYPE.ASC);
    });
    return filters;
};
const populateFilterItems = (filter, items, oldItems) => {
    if (filter.populateItems) {
        const itemsForFilter = filter.isCurrent ? oldItems || items : items;
        filter.items = getFieldFilterItems(filter.fieldName, filter.values || [], itemsForFilter);
    }
};
const getSearchFieldsFromColumns = (columns) => {
    if (!columns)
        return [];
    const searchFields = [];
    const filterColumns = columns.filter((column) => column.searchable !== undefined);
    filterColumns.forEach((column) => {
        const filter = getSearchFieldByColumn(column);
        searchFields.push(filter);
    });
    return searchFields;
};
const getFiltersFromColumns = (columns, items, gridViewType) => {
    if (!columns)
        return [];
    let filters = [];
    const filterColumns = columns.filter((column) => column.filterType !== undefined);
    filterColumns.forEach((column) => {
        const filter = getFilterByColumn(column, items, gridViewType);
        filters.push(filter);
    });
    filters = applySortingDefault(filters, 'order', SORT_TYPE.ASC);
    return filters;
};
const getFilterWithItems = (filter, items) => {
    filter.items = getFieldFilterItems(filter.fieldName, [], items);
    filter.items = applySortingDefault(filter.items, FILTER_ITEM_TEXT_FIELD, SORT_TYPE.ASC);
    return filter;
};
const getGeneralFilter = (filter, items) => filter;
const applyFilterMapper = {
    [FilterType.SelectionFilter]: applyFilterWithItems,
    [FilterType.RangeFilter]: applyRangeFilter,
    [FilterType.TimeLineFilter]: applyRangeFilter,
    [FilterType.ToggleFilter]: applyFilterWithItems
};
const getFilterMapper = {
    [FilterType.SelectionFilter]: getFilterWithItems,
    [FilterType.RangeFilter]: getGeneralFilter,
    [FilterType.ToggleFilter]: getFilterWithItems,
    [FilterType.TimeLineFilter]: getGeneralFilter
};
const getFilterByColumn = (column, items, gridViewType) => {
    const filter = {
        id: column.key,
        filterType: column.filterType,
        operation: FilterOperation.Equal,
        dataType: column.filterDataType,
        order: column.filterOrder,
        label: column.name,
        isCollapsible: true,
        fieldName: column.fieldName,
        itemsSearchRequired: column.filterItemsSearchRequired || column.filterItemsSearchRequired === false
            ? column.filterItemsSearchRequired
            : false,
        items: applySortingDefault(column.filterItems, 'label', SORT_TYPE.ASC),
        hideSelectAll: column.hideSelectAll,
        values: [],
        populateItems: !(column.filterItems && column.filterItems.length),
        applyFilter: gridViewType === GridViewType.InMemory
            ? column.applyFilter || applyFilterMapper[column.filterType]
            : undefined,
        FilterComponent: column.FilterComponent
    };
    if (gridViewType === GridViewType.InMemory &&
        !(column.filterItems && column.filterItems.length)) {
        getFilterMapper[column.filterType] && getFilterMapper[column.filterType](filter, items);
    }
    return filter;
};
const getSearchFieldByColumn = (column) => {
    const searchField = {
        label: column.name,
        fieldName: column.fieldName,
        applySearchText: column.applySearchText
    };
    return searchField;
};
export const updateColumns = (newColumns, existingColumns, sortingOptions, onColumnSort, removeSorting, isActionColumnRequired) => {
    newColumns.forEach((column) => {
        column.columnActionsMode =
            removeSorting || column.disableSort
                ? ColumnActionsMode.disabled
                : column.columnActionsMode || ColumnActionsMode.clickable;
        column.isResizable = column.isResizable !== undefined ? column.isResizable : true;
        column.isSorted =
            removeSorting || column.disableSort
                ? undefined
                : column.isSorted ||
                    (sortingOptions ? sortingOptions.sortColumn === column.key : undefined);
        if (!removeSorting && column.isSorted) {
            column.isSortedDescending = sortingOptions
                ? sortingOptions.sortType === SORT_TYPE.DESC
                : undefined;
        }
        column.selected =
            column.required === undefined && column.selected === undefined
                ? true
                : column.required || column.selected;
        column.onColumnClick = column.onColumnClick || onColumnSort;
        let existingColumn = existingColumns && existingColumns.find((col) => col.key === column.key);
        column.selected = existingColumn ? existingColumn.selected : column.selected;
        if (!column.onRenderBackup) {
            column.onRenderBackup = column.onRender;
        }
    });
    return newColumns;
};
const getPagingOptions = (pagingOptions) => {
    let options = pagingOptions;
    if (options === null || options === undefined) {
        options = {
            pageNumber: 1,
            pageSize: DEFAULT_PAGE_SIZE
        };
    }
    return options;
};
const updateSelections = (props, selection) => {
    if (!(props.selectedItems && props.selectedItems.length) &&
        props.selectFirstItemOnLoad &&
        props.items.length) {
        let items = selection.getItems();
        let firstItem = items.length && items[0];
        if (firstItem) {
            let index = items.findIndex((item) => item[props.itemUniqueField] === firstItem[props.itemUniqueField]);
            if (index >= 0) {
                selection.setIndexSelected(index, true, false);
            }
        }
    }
};
const getFilterData = (props) => {
    if (props.gridViewType === GridViewType.ServerSide) {
        return props.items;
    }
    let filteredItems = [...props.items];
    // Applying Filters
    filteredItems = applyFilters(props.selectedFilters, filteredItems);
    filteredItems = applySearchText(props.searchText, filteredItems, props.searchFields, props.itemUniqueField);
    // Applying sort
    if (props.sortingOptions && props.sortingOptions.length) {
        filteredItems = applySorting(filteredItems, props.sortingOptions[0]);
    }
    return filteredItems;
};
export const getFilteredSelectedItems = (items, selectedItems, itemUniqueField) => {
    let filteredSelectedItems = [];
    selectedItems &&
        selectedItems.length &&
        selectedItems.forEach((selectedItem) => {
            let selected = items.find((item) => item[itemUniqueField] === selectedItem[itemUniqueField]);
            selected && filteredSelectedItems.push(selected);
        });
    return filteredSelectedItems;
};
const getActionTypeForItems = (state) => {
    const action = state.hidePaging || state.allowGrouping
        ? GRIDVIEW_ACTIONS.SET_FILTER_ITEMS
        : state.gridViewType === GridViewType.InMemory
            ? GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS
            : GRIDVIEW_ACTIONS.SET_ITEMS;
    return action;
};
export const getItems = (state) => {
    if (!state) {
        return [];
    }
    const items = state.hidePaging || state.allowGrouping
        ? state.filteredItems
        : state.gridViewType === GridViewType.InMemory
            ? state.paginatedFilteredItems
            : state.items;
    return items || [];
};
