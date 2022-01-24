import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createUseStyles } from 'react-jss';
import { Stack, StackItem, Icon, ShimmerElementType, mergeStyles, Shimmer } from '@fluentui/react';
import {
  HighlightText,
  SORT_TYPE,
  Pagination,
  PaginationWithoutPages
} from 'react-ui-common-controls';
import { cloneDeep } from 'lodash';
import {
  IGridFilter,
  GridViewType,
  IGridColumn,
  IGridViewParams,
  IPagingOptions,
  ISortingOptions,
  IQuickActionSectionParams,
  IGridViewCallbacks,
  IGridViewData,
  GridViewChangeType,
  IDefaultSelections,
  IGridViewMessage,
  IGridViewMessageData,
  GridViewMessageType,
  IExportOptions,
  PageType,
  DEFAULT_MESSAGE_DISMISS_TIME
} from './GridView.models';
import { GridViewDefault } from './GridViewDefault';
import { useInit, useSelection, getUpdateFilters } from './GridView.hooks';
import { IGridViewActions } from './GridView.actions';
import { QuickActionSection as QuickActionSectionDefault } from './QuickActionSection';
import { FilterTags } from './FilterTag';
import { GridFilterPanel } from './GridFilters';
import { StatusMessages } from './StatusMessage';
import { GridSummary } from './GridSummary';
import { gridViewStyles } from './GridView.styles';
import { GridViewContext } from './GridView.context';

const useStyles = createUseStyles(gridViewStyles);
let isInitialLoad = false;

export const GridView: React.FC<IGridViewParams> = (props: IGridViewParams) => {
  // #region "State initialization"
  const classes = useStyles();
  const {
    QuickActionSectionComponent,
    GridSummaryComponent,
    FilterTagsComponent,
    GridComponent,
    CardComponent,
    SideFilterComponent,
    StatusMessageSectionComponent,
    NoResultsComponent,
    PagerComponent
  } = props;

  const callBacks: IGridViewCallbacks = {
    onColumnClick
  };
  const { state, actions } = useInit(props, callBacks);
  const [showFilters, toggleFilters] = useState(false);
  const [filtersToApply, setFiltersToApply] = useState<IGridFilter[]>();
  const [filtersData, setFiltersData] = useState<IGridFilter[]>([]);
  const [statusMessages, setStatusMessages] = useState<IGridViewMessageData[]>([]);

  const stateRef = React.useRef<IGridViewData>();
  const actionsRef = React.useRef<any>();
  const msgRef = React.useRef<IGridViewMessageData[]>();
  stateRef.current = state;
  actionsRef.current = actions;
  msgRef.current = statusMessages;

  React.useEffect(() => {
    updateMessageList(props.statusMessages);
  }, [props.statusMessages]);

  // #endregion "State initialization"

  // #region "Event Handler Section"

  const onSelectionChange = () => {
    const currentActions = actionsRef.current as IGridViewActions;
    currentActions.applySelectedItems(selection.getSelection());
    if (!isInitialLoad) {
      props.onHandleChange &&
        props.onHandleChange(
          getSelections(GridViewChangeType.SelectedItems, selection.getSelection()),
          GridViewChangeType.SelectedItems
        );
    }
    isInitialLoad = false;
  };

  const selection = useSelection(
    onSelectionChange,
    props.allowSelection ? props.items : [],
    props.itemUniqueField!
  );

  React.useEffect(() => {
    if (!compareSelections(props.selectedItems!, state.selectedItems!)) {
      state.selectedItems = props.selectedItems;
      props.allowSelection &&
        props.selectedItems &&
        updateSelections(props.selectedItems, props.itemUniqueField!);
    }
  }, [props.selectedItems]);

  const compareSelections = (selections: any[] = [], oldSelections: any[] = []) => {
    const newSelectedKeys = selections.map((item: any) => item[props.itemUniqueField!]);
    const oldSelectedKeys = oldSelections.map((item: any) => item[props.itemUniqueField!]);
    return JSON.stringify(newSelectedKeys) === JSON.stringify(oldSelectedKeys);
  };

  const updateSelections = (selectedItems: any[], itemUniqueField: string) => {
    resetSelection();
    selectedItems.forEach((item) => {
      let index = props.items.findIndex((i) => i[itemUniqueField] === item[itemUniqueField]);
      if (index >= 0) {
        isInitialLoad = true;
        selection && selection.setIndexSelected(index, true, false);
        // selection && selection.setKeySelected(item[itemUniqueField], true, false);
      }
    });
  };

  const getItems = () => {
    const items =
      props.hidePaging || props.allowGrouping
        ? state.filteredItems
        : props.gridViewType === GridViewType.InMemory
        ? state.paginatedFilteredItems
        : state.items;
    return items;
  };

  const getSelections = (changeType?: GridViewChangeType, value?: any) => {
    const defaultSelections: IDefaultSelections = {
      searchText:
        changeType === GridViewChangeType.SearchText ? value : stateRef.current!.searchText || '',
      pagingOptions:
        changeType === GridViewChangeType.Pagination ? value : stateRef.current!.pagingOptions,
      sortingOptions:
        changeType === GridViewChangeType.Sorting ? value : stateRef.current!.sortingOptions,
      selectedFilters:
        changeType === GridViewChangeType.SelectedFilters
          ? value
          : stateRef.current!.selectedFilters,
      selectedItems:
        changeType === GridViewChangeType.SelectedItems ? value : stateRef.current!.selectedItems,
      groupBy:
        changeType === GridViewChangeType.GroupBy ? value : stateRef.current!.groupColumn?.key
    };
    return defaultSelections;
  };

  const updateMessageList = (newMessages: IGridViewMessage[] = []) => {
    const newMessageList: IGridViewMessageData[] = [];
    newMessages &&
      newMessages.forEach((item, index) => {
        const newMessage: IGridViewMessageData = {
          id: (new Date().getTime() + index).toString(),
          message: item.message,
          messageType: item.messageType,
          timestamp: new Date(),
          autoDismiss: item.autoDismiss
        };
        newMessageList.push(newMessage);
      });
    const messages = newMessageList.concat(statusMessages);
    setStatusMessages(messages);
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

  const getUpdatedMessageList = (messages: IGridViewMessageData[] = []) => messages.slice(0, 2);
  const onDismissMessage = (message: IGridViewMessageData, useRef?: boolean) => {
    const messages = [...(useRef ? msgRef.current! : statusMessages)];
    const index = messages.findIndex((item) => item.id === message.id);
    if (index > -1) {
      messages.splice(index, 1);
      setStatusMessages(messages);
    }
  };

  const onToggleFilter = (showFilter: boolean) => {
    if (showFilter && props.gridViewType === GridViewType.ServerSide) {
      setFiltersData(cloneDeep(state.filters!));
      setFiltersToApply(cloneDeep(state.selectedFilters!));
    }
    toggleFilters(showFilter);
  };

  function onColumnClick(e: React.MouseEvent<HTMLElement>, column: IGridColumn) {
    onColumnSort(e, column);
  }

  const onColumnSort = (e: React.MouseEvent<HTMLElement>, column: IGridColumn) => {
    const currentState = stateRef.current as IGridViewData;
    const currentActions = actionsRef.current as IGridViewActions;
    if (!(currentState && currentState.columns)) return;

    let sortingOptions =
      currentState.sortingOptions! && currentState.sortingOptions.length
        ? currentState.sortingOptions[0]
        : undefined;

    const columns = currentState.columns || [];
    let sortColumn = sortingOptions ? sortingOptions.sortColumn : '';
    const colIndex = columns.findIndex((item) => item.key === column.key);
    if (sortColumn === column.key) {
      columns[colIndex].isSortedDescending = !columns[colIndex].isSortedDescending;
    } else {
      columns.forEach((col) => {
        col.isSorted = false;
      });
      columns[colIndex].isSorted = true;
      sortColumn = column.key;
    }
    sortingOptions = {
      sortType: columns[colIndex].isSortedDescending === true ? SORT_TYPE.DESC : SORT_TYPE.ASC,
      sortColumn,
      sortField: column.fieldName!
    };
    currentActions.applySorting(currentState.filteredItems!, [sortingOptions], columns);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.Sorting, [sortingOptions]),
        GridViewChangeType.Sorting
      );
  };

  const onPaginationChange = (pageNumber?: number, pageSize?: number) => {
    if (
      pageNumber === state.pagingOptions?.pageNumber &&
      pageSize === state.pagingOptions?.pageSize
    ) {
      return;
    }
    // pagingChange = true;
    const pagingOptions = state.pagingOptions as IPagingOptions;
    if (pageNumber) {
      pagingOptions.pageNumber = pageNumber;
    }
    if (pageSize) {
      pagingOptions.pageSize = pageSize;
    }
    actions.applyPaging(state.filteredItems!, pagingOptions);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.Pagination, pagingOptions),
        GridViewChangeType.Pagination
      );
  };

  const onPageChangeWithoutPages = (pageType: PageType) => {
    // pagingChange = true;
    const pagingOptions: IPagingOptions = {
      pageNumber: -1,
      pageSize: -1,
      pageType
    };
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.Pagination, pagingOptions),
        GridViewChangeType.Pagination
      );
  };

  const onFiltersChange = (filters: IGridFilter[]) => {
    actions.applyFilters(state.items, filters);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.SelectedFilters, filters),
        GridViewChangeType.SelectedFilters
      );
  };

  const onFilterChange = (filter: IGridFilter) => {
    let selectedFilters =
      props.gridViewType === GridViewType.InMemory ? state.selectedFilters : filtersToApply;
    selectedFilters = selectedFilters || [];
    const filterIndex = selectedFilters.findIndex((item) => item.id === filter.id);
    if (filterIndex > -1) {
      selectedFilters[filterIndex] = filter;
    } else {
      selectedFilters.push(filter);
    }
    selectedFilters = selectedFilters.filter(
      (selectedFilter) => selectedFilter.values && selectedFilter.values.length > 0
    );
    selectedFilters = selectedFilters.map((item) => {
      item.isCurrent = filter ? filter.id === item.id : false;
      return item;
    });
    if (props.gridViewType === GridViewType.InMemory) {
      onFiltersChange(selectedFilters);
    } else {
      setFiltersToApply(selectedFilters);
      const filters = getUpdateFilters(filtersData, selectedFilters, [], undefined, false);
      setFiltersData(filters);
    }
  };

  const onApplyFilters = () => {
    onFiltersChange(filtersToApply!);
    setFiltersToApply([]);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.SelectedFilters, filtersToApply),
        GridViewChangeType.SelectedFilters
      );
    toggleFilters(false);
  };

  const onApplyFilter = (filter: IGridFilter) => {
    let { selectedFilters } = state;
    selectedFilters = selectedFilters || [];
    const filterIndex = selectedFilters.findIndex((item) => item.id === filter.id);
    selectedFilters[filterIndex] = filter;
    selectedFilters = selectedFilters.filter(
      (selectedFilter) => selectedFilter.values && selectedFilter.values.length > 0
    );
    selectedFilters = selectedFilters.map((item) => {
      item.isCurrent = filter ? filter.id === item.id : false;
      return item;
    });
    onFiltersChange(selectedFilters);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.SelectedFilters, selectedFilters),
        GridViewChangeType.SelectedFilters
      );
  };

  const onRowItemClick = (column: any, item: any) => {
    props.onGridRowItemClick && props.onGridRowItemClick(column, item);
  };

  const onSearchTextChange = (searchText: string) => {
    actions.applyFilterText(state.items, searchText);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.SearchText, searchText),
        GridViewChangeType.SearchText
      );
  };

  const onColumnChange = (columns: IGridColumn[]) => {
    actions.applySelectedColumns(columns);
  };

  const onRemoveFilter = (filterKey: string) => {
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

  const resetSelection = () => {
    if (selection && selection.count > 0) {
      isInitialLoad = true;
      stateRef.current!.selectedItems = [];
      selection.setAllSelected(false);
    }
  };

  const onSort = (sortingOptions: ISortingOptions[]) => {
    const currentState = stateRef.current as IGridViewData;
    const currentActions = actionsRef.current as IGridViewActions;
    currentActions.applySorting(currentState.filteredItems!, sortingOptions, currentState.columns!);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.Sorting, sortingOptions),
        GridViewChangeType.Sorting
      );
  };

  const onExport = (fileType: string) => {
    const selections = getSelections();
    const exportOptions: IExportOptions = {
      fileType
    };
    props.onExport && props.onExport(exportOptions, selections);
  };

  const onEdit = () => {
    const selections = getSelections();
    props.onEdit && props.onEdit(selections.selectedItems?.length && selections.selectedItems[0]);
  };

  const onDelete = () => {
    const selections = getSelections();
    props.onDelete && props.onDelete(selections.selectedItems);
  };

  const onGroupColumnChange = (column?: IGridColumn) => {
    if (state.groupColumn && column && state.groupColumn.key === column.key) {
      return;
    }
    actions.applyGrouping(column);
    if (selection.count !== 0) {
      isInitialLoad = true;
      stateRef.current!.selectedItems = [];
      selection.setAllSelected(false);
    }
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.GroupBy, state.groupColumn?.key),
        GridViewChangeType.GroupBy
      );
  };

  // #endregion "Render HTML Section"

  // #region "Render HTML Section"

  const getQuickActionSection: any = () => {
    const quickActionSectionParams: IQuickActionSectionParams = {
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
      onRefresh: props.onRefresh!,
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
      return <QuickActionSectionComponent {...quickActionSectionParams} />;
    }
    return (
      !props.hideQuickActionSection &&
      props.quickActionSectionItems && <QuickActionSectionDefault {...quickActionSectionParams} />
    );
  };

  const getMessageSection = () => {
    if (StatusMessageSectionComponent) {
      return (
        <StatusMessageSectionComponent messages={statusMessages} onDissmiss={onDismissMessage} />
      );
    }
    return (
      <StatusMessages
        messages={getUpdatedMessageList(statusMessages)}
        onDismiss={onDismissMessage}
      />
    );
  };

  const getSelectedFiltersSection = () => {
    if (!state.selectedFilters) {
      return null;
    }
    if (state.selectedFilters.length === 0) {
      return null;
    }
    if (FilterTagsComponent) {
      return (
        <FilterTagsComponent
          filters={state.selectedFilters!}
          maxFilterTagLength={props.maxFilterTagLength}
          onRemoveFilter={onRemoveFilter}
          onClearFilters={props.hideClearFilters ? undefined : onClearFilters}
          onChangeFilter={onFilterChange}
          onApplyFilter={state.gridViewType === GridViewType.ServerSide ? onApplyFilter : undefined}
        />
      );
    }

    return (
      <div className={classes.filterToolbar}>
        <FilterTags
          filters={state.selectedFilters!}
          maxFilterTagLength={props.maxFilterTagLength}
          onRemoveFilter={onRemoveFilter}
          onClearFilters={props.hideClearFilters ? undefined : onClearFilters}
          onChangeFilter={onFilterChange}
          onApplyFilter={state.gridViewType === GridViewType.ServerSide ? onApplyFilter : undefined}
        />
      </div>
    );
  };

  const getGridSummarySection = () => {
    if (props.hideGridSummary) return null;
    return getDefaultGridSummary();
  };

  const getDefaultGridSummary = () => {
    const totalCount =
      state.gridViewType === GridViewType.InMemory
        ? state.filteredItems!.length
        : state.totalRecords!;
    if (GridSummaryComponent) {
      return (
        <GridSummaryComponent
          pageNumber={
            props.hidePaging ||
            (props.gridViewType === GridViewType.InMemory && props.allowGrouping)
              ? undefined
              : state.pagingOptions?.pageNumber
          }
          pageSize={state.pagingOptions?.pageSize}
          totalCount={totalCount}
          selectionCount={
            state.allowSelection ? (state.selectedItems ? state.selectedItems.length : 0) : 0
          }
        />
      );
    }
    return (
      <GridSummary
        pageNumber={
          props.hidePaging ||
          (props.gridViewType === GridViewType.InMemory && props.allowGrouping) ||
          props.pagingOptionsWithoutPage
            ? undefined
            : state.pagingOptions?.pageNumber
        }
        pageSize={state.pagingOptions?.pageSize}
        totalCount={totalCount}
        selectionCount={
          state.allowSelection ? (state.selectedItems ? state.selectedItems.length : 0) : 0
        }
      />
    );
  };

  const getGridViewSection = () => (
    <div className={classes.gridViewData}>
      {getGridViewData()}
      {getGridViewSideFilter()}
    </div>
  );

  const getHighLightedColumns = (columns: IGridColumn[]) => {
    let searchableColumns = columns.filter((col) => col.searchable === true && !col.onRender);
    searchableColumns.forEach((column) => {
      column.onRender =
        column.onRender ||
        ((item: any) => {
          let value = item[column.fieldName!];
          value = value === 0 ? value : value || '';
          return (
            <HighlightText
              text={value.toString()}
              textToBeHighlighted={stateRef.current!.searchText || ''}
            />
          );
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
      return (
        <div className={items!.length ? gridViewDataClass : classes.gridViewNoData}>
          <GridComponent
            {...props}
            items={items || []}
            columns={columns}
            selection={selection}
            groups={props.allowGrouping ? props.groups || state.groups : undefined}
          />
        </div>
      );
    }
    if (CardComponent) {
      return (
        <div className={items!.length ? gridViewDataClass : classes.gridViewNoData}>
          {props.items.map((item, index) => {
            const cardProps = { ...props, item };
            return <CardComponent key={index} {...cardProps} />;
          })}
        </div>
      );
    }
    return (
      <div className={items!.length ? gridViewDataClass : classes.gridViewNoData}>
        <GridViewDefault
          {...props}
          items={items || []}
          columns={columns}
          selection={selection}
          groups={props.allowGrouping ? props.groups || state.groups : undefined}
        />
      </div>
    );
  };

  const getGridViewSideFilter = () => {
    const filters = props.gridViewType === GridViewType.InMemory ? state.filters : filtersData;
    if (SideFilterComponent) {
      return (
        <SideFilterComponent
          showFilters={showFilters}
          toggleFilters={onToggleFilter}
          filters={filters}
          onFilterChange={onFilterChange}
          onApplyFilters={
            state.gridViewType === GridViewType.ServerSide ? onApplyFilters : undefined
          }
        />
      );
    }
    return (
      <GridFilterPanel
        showFilters={showFilters}
        toggleFilters={onToggleFilter}
        filters={filters!}
        onFilterChange={onFilterChange}
        onApplyFilters={state.gridViewType === GridViewType.ServerSide ? onApplyFilters : undefined}
      />
    );
  };

  const getNoResultsSection = () => {
    const totalCount =
      state.gridViewType === GridViewType.InMemory
        ? state.filteredItems!.length
        : state.totalRecords!;
    if (totalCount !== 0) {
      return null;
    }
    if (NoResultsComponent) {
      return (
        <Stack>
          <StackItem align="center">
            <NoResultsComponent totalRecords={totalCount} />
          </StackItem>
        </Stack>
      );
    }
    return (
      <Stack>
        <StackItem align="center">
          <Icon iconName="Search" className={classes.noResultsIcon} />
        </StackItem>
        <StackItem align="center">
          <div className={classes.noResults}>No Items</div>
        </StackItem>
      </Stack>
    );
  };

  const getPager = () => {
    if (props.hidePaging || (props.gridViewType === GridViewType.InMemory && props.allowGrouping))
      return null;
    const totalCount =
      state.gridViewType === GridViewType.InMemory
        ? state.filteredItems!.length
        : state.totalRecords!;

    if (PagerComponent) {
      return (
        <PagerComponent
          pageNumber={state.pagingOptions?.pageNumber}
          pageSize={state.pagingOptions?.pageSize}
          totalCount={totalCount}
          onPaginationChange={onPaginationChange}
        />
      );
    }
    return (
      <div className={classes.gridViewPager}>
        {props.pagingOptionsWithoutPage && state.gridViewType === GridViewType.ServerSide ? (
          <PaginationWithoutPages
            onPageChange={onPageChangeWithoutPages}
            isPreviousAllowed={props.pagingOptionsWithoutPage.isPreviousAllowed}
            isNextAllowed={props.pagingOptionsWithoutPage.isNextAllowed}
          />
        ) : (
          <Pagination
            pageNumber={state.pagingOptions?.pageNumber}
            pageSize={state.pagingOptions?.pageSize}
            totalCount={totalCount}
            onPaginationChange={onPaginationChange}
          />
        )}
      </div>
    );
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
    items.push(
      <Shimmer
        key={0}
        className="shimmerClass"
        shimmerColors={{
          shimmerWave: 'lightgrey'
        }}
        shimmerElements={[
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
        ]}
        width="100%"
      />
    );
    for (let i = 0; i < 15; i++) {
      items.push(
        <Shimmer
          key={i + 1}
          className="shimmerClass"
          shimmerColors={{
            shimmerWave: 'lightgrey'
          }}
          shimmerElements={[
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
          ]}
          width="100%"
        />
      );
    }
    items.push(
      <Shimmer
        key={20}
        className="shimmerClass"
        shimmerColors={{
          shimmerWave: 'lightgrey'
        }}
        shimmerElements={[
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
        ]}
        width="100%"
      />
    );

    return <div className={wrapperClass}>{items}</div>;
  };

  const mergeClassNames = (classNames: (string | undefined)[]) =>
    classNames.filter((className) => !!className).join(' ');

  const gridActionSectionClass = props.actionSectionClass
    ? mergeClassNames([classes.gridViewtopSection, props.actionSectionClass])
    : classes.gridViewtopSection;

  const gridContainerClass = props.gridContainerClass
    ? mergeClassNames([classes.gridView, props.gridContainerClass])
    : classes.gridView;

  if (!(state && state.gridViewType >= 0)) return null;
  return (
    <GridViewContext.Provider value={{ state, actions }}>
      <div className={gridContainerClass}>
        <div className={gridActionSectionClass}>
          {getQuickActionSection()}
          {getMessageSection()}
          {getSelectedFiltersSection()}
        </div>

        <div className={props.gridMainClass}>
          {props.isLoading ? (
            getGridShimmer()
          ) : (
            <>
              {getGridSummarySection()}
              {getGridViewSection()}
              {getNoResultsSection()}
              {getPager()}
            </>
          )}
        </div>
      </div>
    </GridViewContext.Provider>
  );

  // #endregion "HTML Section"
};