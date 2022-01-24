import { useEffect, useReducer, useMemo } from 'react';
import { ColumnActionsMode, IObjectWithKey, Selection } from '@fluentui/react';
import { gridViewReducer } from './GridView.reducers';
import { GRIDVIEW_ACTIONS, IGridViewActions } from './GridView.actions';
import {
  IGridViewData,
  IPagingOptions,
  GridViewType,
  ISortingOptions,
  IGridFilter,
  IGridViewParams,
  IGridColumn,
  IGridViewCallbacks,
  FilterType,
  ISearchField,
  FilterOperation,
  FILTER_ITEM_TEXT_FIELD
} from './GridView.models';
import {
  applyPaging,
  applySorting as applySortingDefault,
  DEFAULT_PAGE_SIZE,
  SORT_TYPE
} from 'react-ui-common-controls';

import {
  applyFilterTextByField,
  getFieldFilterItems,
  applyFiltersByFieldName,
  mergeItems,
  getGridViewGroupsByColumns
} from './GridViewUtils';

export const useInit = (props: IGridViewParams, callbacks: IGridViewCallbacks) => {
  const [state, dispatch] = useReducer(gridViewReducer, {});
  const actions = gridViewActions(dispatch, state) as IGridViewActions;
  useEffect(() => {
    actions.initialize(props, callbacks);
  }, [props.items]);
  return { state: state as IGridViewData, actions };
};

export const useSelection = (
  handleSelectionChange: (selection: Selection<IObjectWithKey>) => void,
  items: any[],
  itemUniqueField: string
) => {
  const selection = useMemo(() => {
    // const itemsWithKey = items.map((item) => {
    //   return { ...item, key: item[itemUniqueField] };
    // });
    return new Selection({
      onSelectionChanged: () => {
        handleSelectionChange(selection);
      },
      items: items
    });
  }, [items]);
  return selection;
};

const gridViewActions = (dispatch: any, state: IGridViewData) => {
  const actions: IGridViewActions = {
    initialize: (props: IGridViewParams, callbacks: IGridViewCallbacks) => {
      const pagingOptions = getPagingOptions(props.pagingOptions);
      const sortingOptions =
        props.sortingOptions! && props.sortingOptions.length ? props.sortingOptions[0] : undefined;
      const initialData: IGridViewData = {
        gridViewType: props.gridViewType,
        items: props.items,
        filteredItems: props.items,
        filters: props.filters || [],
        searchFields: props.searchFields,
        itemUniqueField: props.itemUniqueField,
        totalRecords:
          props.totalRecords || props.totalRecords === 0 ? props.totalRecords : props.items.length,
        columns: updateColumns(
          props.columns,
          sortingOptions!,
          callbacks.onColumnClick,
          props.removeSorting || props.allowMultiLevelSorting
        ),
        allowGrouping: props.allowGrouping || (props.groups && props.groups.length > 0),
        allowGroupSelection: props.allowGroupSelection,
        allowSelection: props.allowSelection
      };

      let filteredItems = [...props.items];

      if (props.gridViewType === GridViewType.InMemory) {
        // Applying Filters
        filteredItems = applyFilters(props.selectedFilters!, filteredItems);

        // update the search Fields
        if (!props.searchFields) {
          initialData.searchFields = getSearchFieldsFromColumns(initialData.columns!);
        }
        // Applying Filter Text
        filteredItems = applySearchText(
          props.searchText!,
          filteredItems,
          props.searchFields!,
          props.itemUniqueField
        );

        // Applying sort
        filteredItems = applySorting(filteredItems, sortingOptions!);
        initialData.filteredItems = filteredItems;

        // Applying Paging
        initialData.paginatedFilteredItems = applyPaging(
          pagingOptions.pageSize,
          pagingOptions.pageNumber,
          filteredItems
        );
      }
      if (!props.hideFilters) {
        // update the filters
        if (!props.filters) {
          initialData.filters = getFiltersFromColumns(
            initialData.columns!,
            filteredItems,
            props.gridViewType
          );
        }
        initialData.filters = getUpdateFilters(
          initialData.filters!,
          props.selectedFilters!,
          filteredItems
        );
      }

      // Create Groups
      if (initialData.allowGrouping) {
        const groupColumns = initialData.columns?.filter((col) => col.grouping === true);
        const groupColumn = props.groupBy
          ? groupColumns?.find((col) => col.key === props.groupBy)
          : undefined;
        initialData.groupColumn = groupColumn;

        const groupedData = getGridViewGroupsByColumns(
          initialData.columns!,
          initialData.filteredItems!,
          groupColumn,
          props.allowGroupSelection
        );
        initialData.groups = groupedData.groups;
        initialData.filteredItems = groupedData.items;
      }
      initialData.pagingOptions = pagingOptions;
      initialData.sortingOptions = props.sortingOptions;
      initialData.selectedFilters = props.selectedFilters || [];
      initialData.selectedItems = props.selectedItems;
      initialData.searchText = props.searchText;
      dispatch({ type: GRIDVIEW_ACTIONS.INITIALIZE, data: initialData });
    },
    applyPaging: (items: any[], pagingOptions: IPagingOptions) => {
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
    applySorting: (items: any[], sortingOptions: ISortingOptions[], columns: IGridColumn[]) => {
      if (state.gridViewType === GridViewType.InMemory) {
        // Apply Sorting
        let filteredItems = [...items];

        const sortingOption =
          sortingOptions! && sortingOptions.length ? sortingOptions[0] : undefined;
        filteredItems = applySorting(filteredItems, sortingOption!);

        // Create Groups
        if (state.allowGrouping) {
          const groupedData = getGridViewGroupsByColumns(
            state.columns!,
            filteredItems!,
            state.groupColumn,
            state.allowGroupSelection
          );
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
        const pagingOptions = state.pagingOptions ?? getPagingOptions();
        const paginatedFilteredItems = applyPaging(pagingOptions.pageSize, 1, filteredItems);
        dispatch({
          type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
          data: paginatedFilteredItems
        });
      }
      const pagingOptions = state.pagingOptions ?? getPagingOptions();
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
    applyFilters: (items: any[], selectedFilters: IGridFilter[]) => {
      if (state.gridViewType === GridViewType.InMemory) {
        let filteredItems = [...items];

        // Applying Filter Text
        filteredItems = applySearchText(
          state.searchText!,
          filteredItems,
          state.searchFields!,
          state.itemUniqueField
        );

        // Applying Filters
        if (selectedFilters.length === 1) {
          selectedFilters[0].isCurrent = true;
        }
        const filtersToInclude = selectedFilters.filter((filter) => filter.isCurrent !== true);
        const filterItemsWithIncludeFilters = applyFilters(filtersToInclude, [...filteredItems]);

        filteredItems = applyFilters(selectedFilters, filteredItems);

        // update the filters
        if (state.filters && state.filters.length > 0) {
          const filters = getUpdateFilters(
            state.filters!,
            selectedFilters,
            filteredItems,
            filterItemsWithIncludeFilters
          );
          dispatch({
            type: GRIDVIEW_ACTIONS.SET_FILTERS,
            data: filters
          });
        }

        // Applying sort
        const sortingOptions =
          state.sortingOptions! && state.sortingOptions.length
            ? state.sortingOptions[0]
            : undefined;
        filteredItems = applySorting(filteredItems, sortingOptions!);

        // Create Groups
        if (state.allowGrouping) {
          const groupedData = getGridViewGroupsByColumns(
            state.columns!,
            filteredItems!,
            state.groupColumn,
            state.allowGroupSelection
          );
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
        const pagingOptions = state.pagingOptions ?? getPagingOptions();
        const paginatedFilteredItems = applyPaging(pagingOptions.pageSize, 1, filteredItems);
        dispatch({
          type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
          data: paginatedFilteredItems
        });
      } else if (state.filters && state.filters.length > 0) {
        const filters = getUpdateFilters(state.filters!, selectedFilters, [], undefined, false);
        dispatch({ type: GRIDVIEW_ACTIONS.SET_FILTERS, data: filters });
      }
      const pagingOptions = state.pagingOptions ?? getPagingOptions();
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
    applyFilterText: (items: any[], filterText: string) => {
      if (state.gridViewType === GridViewType.InMemory) {
        let filteredItems = [...items];

        // Applying Filters
        filteredItems = applyFilters(state.selectedFilters!, filteredItems);

        // Applying Filter Text
        filteredItems = applySearchText(
          filterText,
          filteredItems,
          state.searchFields!,
          state.itemUniqueField
        );

        // update the filters
        if (state.filters && state.filters.length > 0) {
          const filters = getUpdateFilters(state.filters!, state.selectedFilters!, filteredItems);
          dispatch({
            type: GRIDVIEW_ACTIONS.SET_FILTERS,
            data: filters
          });
        }

        // Apply Sorting
        const sortingOptions =
          state.sortingOptions! && state.sortingOptions.length
            ? state.sortingOptions[0]
            : undefined;
        filteredItems = applySorting(filteredItems, sortingOptions!);

        // Create Groups
        if (state.allowGrouping) {
          const groupedData = getGridViewGroupsByColumns(
            state.columns!,
            filteredItems!,
            state.groupColumn,
            state.allowGroupSelection
          );
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
        const pagingOptions = state.pagingOptions ?? getPagingOptions();
        const paginatedFilteredItems = applyPaging(pagingOptions.pageSize, 1, filteredItems);
        dispatch({
          type: GRIDVIEW_ACTIONS.SET_PAGINATED_FILTERED_ITEMS,
          data: paginatedFilteredItems
        });
      }
      const pagingOptions = state.pagingOptions ?? getPagingOptions();
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
    applyGrouping: (column?: IGridColumn) => {
      if (state.gridViewType === GridViewType.InMemory) {
        let filteredItems = [...state.items];

        // Applying Filters
        filteredItems = applyFilters(state.selectedFilters!, filteredItems);

        // Applying Filter Text
        filteredItems = applySearchText(
          state.searchText!,
          filteredItems,
          state.searchFields!,
          state.itemUniqueField
        );

        // update the filters
        if (state.filters && state.filters.length > 0) {
          const filters = getUpdateFilters(state.filters!, state.selectedFilters!, filteredItems);
          dispatch({
            type: GRIDVIEW_ACTIONS.SET_FILTERS,
            data: filters
          });
        }

        // Apply Sorting
        const sortingOptions =
          state.sortingOptions! && state.sortingOptions.length
            ? state.sortingOptions[0]
            : undefined;
        filteredItems = applySorting(filteredItems, sortingOptions!);

        // Create Groups
        if (state.allowGrouping) {
          const groupedData = getGridViewGroupsByColumns(
            state.columns!,
            filteredItems!,
            column,
            state.allowGroupSelection
          );
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
    applySelectedItems: (selectedItems: any[]) => {
      const selected: any[] = [];
      selectedItems.forEach((item) => {
        if (!selected.find((i) => i[state.itemUniqueField!] === item[state.itemUniqueField!])) {
          selected.push(item);
        }
      });
      dispatch({
        type: GRIDVIEW_ACTIONS.SET_SELECTED_ITEMS,
        data: selected
      });
    },
    applySelectedColumns: (selectedColumns: IGridColumn[]) => {
      dispatch({
        type: GRIDVIEW_ACTIONS.SET_COLUMNS,
        data: selectedColumns
      });
    },
    setFiltersToApply: (filters?: IGridFilter[]) => {
      dispatch({
        type: GRIDVIEW_ACTIONS.SET_FILTERS_TO_APPLY,
        data: filters
      });
    },
    setFilterToApply: (filter?: IGridFilter) => {
      dispatch({
        type: GRIDVIEW_ACTIONS.SET_FILTER_TO_APPLY,
        data: filter
      });
    }
  };
  return actions;
};

const applyFilters = (filters: IGridFilter[], items: any[]) => {
  if (!filters) {
    return items;
  }
  let filteredItems = items;
  filters.forEach((filter) => {
    filteredItems = filter.applyFilter ? filter.applyFilter(filter, filteredItems) : filteredItems;
  });
  return filteredItems;
};

const applyFilterWithItems = (filter: IGridFilter, items: any[]) =>
  applyFiltersByFieldName(filter.values, items, filter.fieldName);

const applyRangeFilter = (filter: IGridFilter, items: any[]) =>
  applyFiltersByFieldName(
    filter.values,
    items,
    filter.fieldName,
    filter.dataType,
    filter.operation
  );

const applySearchText = (
  searchText: string,
  items: any[],
  searchFields: ISearchField[],
  itemUniqueField?: string
) => {
  if (!searchFields || !searchText) {
    return items;
  }
  let itemList = items;
  if (searchFields && searchFields.length > 0) {
    const filteredItems: any[] = [];
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

const applySorting = (items: any[], sortingOptions: ISortingOptions) => {
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

export const getUpdateFilters = (
  gridFilters: IGridFilter[],
  selectedFilters: IGridFilter[],
  items: any[],
  oldItems?: any[],
  isInMemory: boolean = true
) => {
  const filters = gridFilters || [];
  filters.forEach((filter) => {
    filter.isCurrent = false;
    filter.data = {};
    filter.values = [];
    filter.items = filter.items?.map((item) => {
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
    if (
      isInMemory &&
      (filter.filterType === FilterType.SelectionFilter ||
        filter.filterType === FilterType.ToggleFilter)
    ) {
      populateFilterItems(filter, items, oldItems!);
    }
    filter.items = applySortingDefault(filter.items || [], FILTER_ITEM_TEXT_FIELD, SORT_TYPE.ASC);
  });
  return filters;
};

const populateFilterItems = (filter: IGridFilter, items: any[], oldItems: any[]) => {
  if (filter.populateItems) {
    const itemsForFilter = filter.isCurrent ? oldItems || items : items;
    filter.items = getFieldFilterItems(filter.fieldName, filter.values || [], itemsForFilter);
  }
};

const getSearchFieldsFromColumns = (columns: IGridColumn[]) => {
  if (!columns) return [];
  const searchFields: ISearchField[] = [];
  const filterColumns = columns.filter((column) => column.searchable !== undefined);
  filterColumns.forEach((column) => {
    const filter = getSearchFieldByColumn(column);
    searchFields.push(filter);
  });
  return searchFields;
};

const getFiltersFromColumns = (
  columns: IGridColumn[],
  items: any[],
  gridViewType?: GridViewType
) => {
  if (!columns) return [];
  let filters: IGridFilter[] = [];
  const filterColumns = columns.filter((column) => column.filterType !== undefined);
  filterColumns.forEach((column) => {
    const filter = getFilterByColumn(column, items, gridViewType);
    filters.push(filter);
  });
  filters = applySortingDefault(filters, 'order', SORT_TYPE.ASC);
  return filters;
};

const getFilterWithItems = (filter: IGridFilter, items: any[]) => {
  filter.items = getFieldFilterItems(filter.fieldName!, [], items);
  filter.items = applySortingDefault(filter.items, FILTER_ITEM_TEXT_FIELD, SORT_TYPE.ASC);
  return filter;
};

const getGeneralFilter = (filter: IGridFilter, items: any[]) => filter;

const applyFilterMapper: any = {
  [FilterType.SelectionFilter]: applyFilterWithItems,
  [FilterType.RangeFilter]: applyRangeFilter,
  [FilterType.TimeLineFilter]: applyRangeFilter,
  [FilterType.ToggleFilter]: applyFilterWithItems
};

const getFilterMapper: any = {
  [FilterType.SelectionFilter]: getFilterWithItems,
  [FilterType.RangeFilter]: getGeneralFilter,
  [FilterType.ToggleFilter]: getFilterWithItems,
  [FilterType.TimeLineFilter]: getGeneralFilter
};

const getFilterByColumn = (column: IGridColumn, items: any[], gridViewType?: GridViewType) => {
  const filter: IGridFilter = {
    id: column.key,
    filterType: column.filterType!,
    operation: FilterOperation.Equal,
    dataType: column.filterDataType,
    order: column.filterOrder!,
    label: column.name,
    isCollapsible: true,
    fieldName: column.fieldName!,
    itemsSearchRequired:
      column.filterItemsSearchRequired || column.filterItemsSearchRequired === false
        ? column.filterItemsSearchRequired
        : false,
    items: applySortingDefault(column.filterItems!, 'label', SORT_TYPE.ASC),
    hideSelectAll: column.hideSelectAll,
    values: [],
    populateItems: !(column.filterItems && column.filterItems.length),
    applyFilter:
      gridViewType === GridViewType.InMemory
        ? column.applyFilter || applyFilterMapper[column.filterType!]
        : undefined,
    FilterComponent: column.FilterComponent
  };
  if (
    gridViewType === GridViewType.InMemory &&
    !(column.filterItems && column.filterItems.length)
  ) {
    getFilterMapper[column.filterType!] && getFilterMapper[column.filterType!](filter, items);
  }
  return filter;
};

const getSearchFieldByColumn = (column: IGridColumn) => {
  const searchField: ISearchField = {
    label: column.name,
    fieldName: column.fieldName!,
    applySearchText: column.applySearchText!
  };
  return searchField;
};

const updateColumns = (
  columns: IGridColumn[],
  sortingOptions: ISortingOptions,
  onColumnSort: any,
  removeSorting?: boolean
) => {
  columns.forEach((column) => {
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
    column.selected = column.required || column.selected;
    column.onColumnClick = column.onColumnClick || onColumnSort;
  });
  return columns;
};

const getPagingOptions = (pagingOptions?: IPagingOptions) => {
  let options = pagingOptions;
  if (options === null || options === undefined) {
    options = {
      pageNumber: 1,
      pageSize: DEFAULT_PAGE_SIZE
    };
  }
  return options;
};