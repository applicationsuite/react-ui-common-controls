import React from 'react';
import { createUseStyles } from 'react-jss';
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { Shimmer, ShimmerElementType } from '@fluentui/react/lib/Shimmer';
import { PrimaryButton, DefaultButton, CommandBarButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { ComboBox, IComboBoxOption } from '@fluentui/react/lib/ComboBox';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { DayOfWeek } from '@fluentui/react/lib/DateTimeUtilities';
import { Dialog, DialogFooter } from '@fluentui/react/lib/Dialog';
import { ColumnActionsMode } from '@fluentui/react/lib/DetailsList';
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
  IExportOptions,
  DEFAULT_MESSAGE_DISMISS_TIME,
  IConfirmation,
  OperationType,
  GRIDVIEW_LOCALIZATION_STRINGS,
  ControlType,
  AlignmentType
} from './GridView.models';
import { GridViewShimmer } from './GridViewShimmer';
import { GridViewDefault } from './GridViewDefault';
import { useInit, getFilteredSelectedItems, getUpdateFilters, getItems } from './GridView.hooks';
import { IGridViewActions } from './GridView.actions';
import { Pagination, PaginationWithoutPages, PageType } from '../Pagination';
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
    onColumnClick,
    onSelectionChange
  };
  const { state, actions, selection } = useInit(props, callBacks);
  const [confirmation, setConfirmation] = React.useState<IConfirmation>({
    showConfirmation: false
  });
  const stateRef = React.useRef<IGridViewData>();
  const actionsRef = React.useRef<IGridViewActions>();
  stateRef.current = state;
  actionsRef.current = actions;
  const localization = useLocalization();

  React.useEffect(() => {
    updateMessageList(props.statusMessages);
  }, [props.statusMessages]);

  // #endregion "State initialization"

  // #region "Event Handler Section"

  function onSelectionChange() {
    const currentActions = actionsRef.current as IGridViewActions;
    const selections = selection.getSelection();
    currentActions.applySelectedItems(selections);
    let newItems = selections.filter((item) => item.isDirty === true && item.isNewItem === true);
    if (newItems.length === selections.length) {
      return;
    }
    if (!isInitialLoad) {
      props.onHandleChange &&
        props.onHandleChange(
          getSelections(GridViewChangeType.SelectedItems, selections),
          GridViewChangeType.SelectedItems
        );
    }
    isInitialLoad = false;
  }

  React.useEffect(() => {
    if (!props.allowSelection) {
      return;
    }
    let filteredSelectedItems = getFilteredSelectedItems(
      props.items,
      props.selectedItems!,
      props.itemUniqueField!
    );
    if (!compareSelections(filteredSelectedItems, state.selectedItems!)) {
      props.selectedItems && updateSelections(filteredSelectedItems!, props.itemUniqueField!);
    }
  }, [props.selectedItems]);

  const compareSelections = (selections: any[] = [], oldSelections: any[] = []) => {
    const newSelectedKeys = selections.map((item: any) => item[props.itemUniqueField!]);
    const oldSelectedKeys = oldSelections.map((item: any) => item[props.itemUniqueField!]);
    return JSON.stringify(newSelectedKeys) === JSON.stringify(oldSelectedKeys);
  };

  const updateSelections = (selectedItems: any[], itemUniqueField: string) => {
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

  const getUpdatedMessageList = (messages: IGridViewMessageData[] = []) => messages.slice(0, 2);
  const onDismissMessage = (message: IGridViewMessageData, useRef?: boolean) => {
    const messages = [...(useRef ? stateRef.current?.statusMessages! : state.statusMessages || [])];
    const index = messages.findIndex((item) => item.id === message.id);
    if (index > -1) {
      messages.splice(index, 1);
      actions.setData({ statusMessages: messages });
    }
  };

  const onToggleFilter = (showFilter: boolean) => {
    if (!props.showFiltersAside && showFilter && props.gridViewType === GridViewType.ServerSide) {
      actions.setData({ availableFilters: cloneDeep(state.filters!) });
      actions.setData({ filtersToApply: cloneDeep(state.selectedFilters!) });
    }
    actions.setData({ showFilters: !state.showFilters });
  };

  function onColumnClick(e: React.MouseEvent<HTMLElement>, column: IGridColumn) {
    onColumnSort(e, column);
  }

  const resetSelection = () => {
    if (props.allowSelection && selection && selection.count > 0) {
      isInitialLoad = true;
      stateRef.current!.selectedItems = [];
      selection.setAllSelected(false);
    }
  };

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
      props.gridViewType === GridViewType.InMemory || props.showFiltersAside
        ? state.selectedFilters
        : state.filtersToApply;
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
    if (props.gridViewType === GridViewType.InMemory || props.showFiltersAside) {
      onFiltersChange(selectedFilters);
    } else {
      actions.setData({ filtersToApply: selectedFilters });
      const filters = getUpdateFilters(
        state.availableFilters || [],
        selectedFilters,
        [],
        undefined,
        false
      );
      actions.setData({ availableFilters: filters });
    }
  };

  const onApplyFilters = () => {
    onFiltersChange(state.filtersToApply!);
    actions.setData({ showFilters: false, filtersToApply: [] });
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
    let itemsToUpdate =
      stateRef.current?.filteredItems?.filter((item) => item.isDirty === true) || [];
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

  const onGroupColumnChange = (column?: IGridColumn) => {
    if (state.groupColumn && column && state.groupColumn.key === column.key) {
      return;
    }
    actions.applyGrouping(column);
    resetSelection();
    props.onHandleChange &&
      props.onHandleChange(
        getSelections(GridViewChangeType.GroupBy, state.groupColumn?.key),
        GridViewChangeType.GroupBy
      );
  };

  const onAddRecord = () => {
    actionsRef.current?.addRecord();
  };

  const onEditRecords = (items: any[]) => {
    actionsRef.current?.editRecords(items);
  };

  const onDeleteRecords = (items: any[]) => {
    const status = actionsRef.current?.deleteRecords(items);
    status && props.onItemsUpdate && props.onItemsUpdate(items, OperationType.Delete);
    setConfirmation({
      showConfirmation: false,
      data: []
    });
  };

  const onCancelRecords = (items: any) => {
    actionsRef.current?.cancelRecords(items);
  };

  const onSaveRecords = (items: any[]) => {
    let errors = 0;
    let columns = stateRef.current?.columns;
    columns = columns?.filter((item) => !(item.readonly || item.key === 'Action')) || [];

    items &&
      items.forEach((item) => {
        columns &&
          columns.forEach((column) => {
            const value = item.updatedData[column.fieldName!];
            if (column.onValidate) {
              item.updatedData[`${column.fieldName!}Error`] = column.onValidate(
                value,
                column,
                item
              );
            } else {
              item.updatedData[`${column.fieldName!}Error`] =
                column.required &&
                !(value === 0 || value === false) &&
                !value &&
                localizedString(COMMON_LOCALIZATION_STRINGS.REQUIRED_FIELD, localization);
            }
            errors = errors + (item.updatedData[`${column.fieldName!}Error`] ? 1 : 0);
          });
      });
    if (errors > 0) {
      actionsRef.current?.changeRecords(items);
      return;
    }
    let status = actionsRef.current?.saveRecords(items);
    let isAdd = items.some((i) => i.isNewItem === true);
    status &&
      props.onItemsUpdate &&
      props.onItemsUpdate(items, isAdd ? OperationType.Add : OperationType.Edit);
  };

  const onRecordUpdate = (column: IGridColumn, value: any, item: any) => {
    item.updatedData = item.updatedData || {};
    item.updatedData[column.fieldName!] = value;
    if (column.onValidate) {
      item.updatedData[`${column.fieldName!}Error`] = column.onValidate(value, column, item);
    } else {
      item.updatedData[`${column.fieldName!}Error`] =
        column.required &&
        !value &&
        localizedString(COMMON_LOCALIZATION_STRINGS.REQUIRED_FIELD, localization);
    }
    actionsRef.current?.changeRecords([item]);
  };

  // #endregion "Render HTML Section"

  // #region "Render HTML Section"

  const getQuickActionSection: any = () => {
    const itemsToEdit = getItemsToEdit();
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
      onEdit:
        !props.hideBulkEdit && props.allowSelection && itemsToEdit.length === 0 && props.allowEdit
          ? onEdit
          : undefined,
      onSave: props.allowEdit && itemsToEdit.length > 0 ? onSave : undefined,
      onCancel: props.allowEdit && itemsToEdit.length > 0 ? onCancel : undefined,
      onDelete:
        !props.hideBulkDelete && props.allowSelection && props.allowDelete ? onDelete : undefined,
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
        <StatusMessageSectionComponent
          messages={state.statusMessages}
          onDissmiss={onDismissMessage}
        />
      );
    }
    return (
      <StatusMessages
        messages={getUpdatedMessageList(state.statusMessages)}
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

  const getGridAddRecordSection = () => {
    if (!props.allowAdd) {
      return null;
    }
    return (
      <CommandBarButton
        className={classes.gridviewAddSection}
        iconProps={{ iconName: 'Add' }}
        text={localizedString(GRIDVIEW_LOCALIZATION_STRINGS.ADD, localization)}
        onClick={onAddRecord}
      />
    );
  };

  const getDeleteConfirmationDialog = () => {
    return (
      <Dialog
        hidden={!confirmation.showConfirmation}
        onDismiss={() => {
          setConfirmation({
            showConfirmation: false,
            data: undefined
          });
        }}
        dialogContentProps={{
          title: localizedString(GRIDVIEW_LOCALIZATION_STRINGS.CONFIRMATION, localization),
          subText: localizedString(GRIDVIEW_LOCALIZATION_STRINGS.CONFIRMATION_MESSAGE, localization)
        }}
        modalProps={{ isBlocking: true }}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              confirmation.confirmCallback && confirmation.confirmCallback(confirmation.data);
            }}
            text={localizedString(COMMON_LOCALIZATION_STRINGS.DELETE, localization)}
          />
          <DefaultButton
            onClick={() => {
              setConfirmation({
                showConfirmation: false,
                data: undefined
              });
            }}
            text={localizedString(COMMON_LOCALIZATION_STRINGS.CANCEL, localization)}
          />
        </DialogFooter>
      </Dialog>
    );
  };

  const getGridViewSection = () => {
    if (props.showFiltersAside) {
      return (
        <div className={classes.fliterGridContainer}>
          {state.showFilters && (
            <div className={classes.filtersSection}>{getGridViewFilters()}</div>
          )}
          <div
            className={
              state.showFilters ? classes.gridViewWithFilters : classes.gridViewWithoutFilters
            }
          >
            {getGridSummarySection()}
            {getGridViewData()}
            {getNoResultsSection()}
            {getGridAddRecordSection()}
            {getPager()}
            {getDeleteConfirmationDialog()}
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.gridViewData}>
          {getGridViewFilterAsSidePanel()}
          {getGridSummarySection()}
          {getGridViewData()}
          {getNoResultsSection()}
          {getGridAddRecordSection()}
          {getPager()}
          {getDeleteConfirmationDialog()}
        </div>
      );
    }
  };

  const renderSaveRecordActionButtons = (item: any, column: IGridColumn) => {
    return (
      !props.hideInlineEdit && (
        <>
          <CommandBarButton
            className={classes.gridviewActionColumnButton}
            iconProps={{ iconName: 'Save' }}
            ariaLabel={localizedString(COMMON_LOCALIZATION_STRINGS.SAVE, localization)}
            title={localizedString(COMMON_LOCALIZATION_STRINGS.SAVE, localization)}
            //text={localizedString(COMMON_LOCALIZATION_STRINGS.SAVE, localization)}
            onClick={() => {
              onSaveRecords([item]);
            }}
          />
          <CommandBarButton
            className={classes.gridviewActionColumnButton}
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel={localizedString(COMMON_LOCALIZATION_STRINGS.CANCEL, localization)}
            title={localizedString(COMMON_LOCALIZATION_STRINGS.CANCEL, localization)}
            //text={localizedString(COMMON_LOCALIZATION_STRINGS.CANCEL, localization)}
            onClick={() => {
              onCancelRecords([item]);
            }}
          />
        </>
      )
    );
  };

  const renderAsTextBox = (controlValue: string, item: any, column: IGridColumn) => {
    return (
      <TextField
        value={controlValue}
        errorMessage={item.updatedData[`${column.fieldName!}Error`]}
        onChange={(e: any, value?: string) => onRecordUpdate(column, value || '', item)}
      />
    );
  };

  const renderAsComboBox = (controlValue: string, item: any, column: IGridColumn) => {
    return (
      <ComboBox
        options={column.editControlOptions || []}
        defaultSelectedKey={controlValue}
        onChange={(event: any, option?: IComboBoxOption) => {
          onRecordUpdate(column, option!.key, item);
        }}
        errorMessage={item.updatedData[`${column.fieldName!}Error`]}
      />
    );
  };

  const renderAsDatePicker = (controlValue: string, item: any, column: IGridColumn) => {
    const date = controlValue ? new Date(controlValue) : undefined;
    return (
      <DatePicker
        firstDayOfWeek={DayOfWeek.Sunday}
        ariaLabel={localizedString(GRIDVIEW_LOCALIZATION_STRINGS.SELECT_DATE, localization)}
        value={date}
        isRequired={column.required}
        onSelectDate={(date?: Date | null) => {
          onRecordUpdate(column, date || '', item);
        }}
      />
    );
  };

  const renderAsCustom = (controlValue: string, item: any, column: IGridColumn) => {
    return column.onRenderEditControl
      ? column.onRenderEditControl(item, onRecordUpdate, column)
      : renderAsLabel(controlValue, item, column);
  };

  const renderAsLabel = (controlValue: string, item: any, column: IGridColumn) => {
    return <span>{controlValue}</span>;
  };

  const renderEditableRow = (item: any, column: IGridColumn) => {
    let value = item.updatedData[column!.fieldName!];
    value = value === 0 || value === false ? value : value || '';
    if (column.formatValue) {
      value = column.formatValue(value, item);
    }
    if (column.readonly) {
      return renderAsLabel(value, item, column);
    } else if (column.editControlType === ControlType.TextBox) {
      return renderAsTextBox(value, item, column);
    } else if (column.editControlType === ControlType.ComboBox) {
      return renderAsComboBox(value, item, column);
    } else if (column.editControlType === ControlType.DatePicker) {
      return renderAsDatePicker(value, item, column);
    } else if (column.editControlType === ControlType.Custom) {
      return renderAsCustom(value, item, column);
    } else {
      return renderAsTextBox(value, item, column);
    }
  };

  const renderColumnInUpdateMode = (item: any, column: IGridColumn) => {
    if (column.key === 'Action') {
      return renderSaveRecordActionButtons(item, column);
    } else {
      return renderEditableRow(item, column);
    }
  };

  const renderEditButton = (item: any) => {
    if (!props.allowEdit) {
      return null;
    } else {
      return (
        <CommandBarButton
          className={classes.gridviewActionColumnButton}
          iconProps={{ iconName: 'Edit' }}
          ariaLabel={localizedString(COMMON_LOCALIZATION_STRINGS.EDIT, localization)}
          title={localizedString(COMMON_LOCALIZATION_STRINGS.EDIT, localization)}
          //text={localizedString(COMMON_LOCALIZATION_STRINGS.EDIT, localization)}
          onClick={() => {
            onEditRecords([item]);
          }}
        />
      );
    }
  };

  const renderDeleteButton = (item: any) => {
    if (!props.allowDelete) {
      return null;
    } else {
      return (
        <CommandBarButton
          className={classes.gridviewActionColumnButton}
          iconProps={{ iconName: 'Delete' }}
          ariaLabel={localizedString(COMMON_LOCALIZATION_STRINGS.DELETE, localization)}
          title={localizedString(COMMON_LOCALIZATION_STRINGS.DELETE, localization)}
          //text={localizedString(COMMON_LOCALIZATION_STRINGS.DELETE, localization)}
          onClick={() => {
            setConfirmation({
              showConfirmation: true,
              data: [item],
              confirmCallback: onDeleteRecords
            });
          }}
        />
      );
    }
  };

  const renderActionColumn = () => {
    const actionColumn: IGridColumn = {
      key: 'Action',
      name: props.hideActionColumnText
        ? ''
        : localizedString(COMMON_LOCALIZATION_STRINGS.ACTION, localization),
      fieldName: 'Action',
      minWidth: 210,
      maxWidth: 210,
      isRowHeader: true,
      isResizable: false,
      columnActionsMode: ColumnActionsMode.disabled,
      required: true,
      selected: true,
      onRender: (item: any) => {
        return (
          <Stack horizontal>
            {!props.hideInlineEdit && renderEditButton(item)}
            {!props.hideInlineDelete && renderDeleteButton(item)}
          </Stack>
        );
      }
    };
    actionColumn.onRenderBackup = actionColumn.onRender;
    return actionColumn;
  };

  const getUpdatedColumns = (columnsData: IGridColumn[]) => {
    let columns = columnsData;
    if (
      (props.allowAdd || props.allowEdit || props.allowDelete) &&
      !columns.filter((col) => col.key === 'Action').length
    ) {
      if (props.actionColumnAlignment && props.actionColumnAlignment === AlignmentType.Left) {
        columns.unshift(renderActionColumn());
      } else {
        columns.push(renderActionColumn());
      }
    }
    const itemsToUpdate = getItemsToEdit();
    if (!(itemsToUpdate.length || (!props.hideQuickSearch && props.highLightSearchText))) {
      return columns;
    }

    columns.forEach((column) => {
      column.onRender = (item: any, index?: number, col?: IGridColumn) => {
        if (item.isDirty) {
          return renderColumnInUpdateMode(item, column!);
        } else if (column?.onRenderBackup) {
          return column?.onRenderBackup(item, index, col);
        } else {
          let value = item[column!.fieldName!];
          value = value === 0 || value === false ? value : value || '';
          return props.highLightSearchText ? (
            <HighlightText
              text={value.toString()}
              textToBeHighlighted={stateRef.current!.searchText || ''}
            />
          ) : (
            <>{value.toString()} </>
          );
        }
      };
    });

    return columns;
  };

  const columns = React.useMemo(() => getUpdatedColumns(state.columns || []), [state.columns]);

  const getGridViewData = () => {
    const items = getItems(stateRef.current!);
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
            selection={props.allowSelection ? selection : undefined}
            groups={props.allowGrouping ? props.groups || state.groups : undefined}
          />
        </div>
      );
    }
    if (CardComponent) {
      return (
        <div className={items!.length ? gridViewDataClass : classes.gridViewNoData}>
          {items.map((item: any, index: number) => {
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
          columns={columns || []}
          selection={props.allowSelection ? selection : undefined}
          groups={props.allowGrouping ? props.groups || state.groups : undefined}
        />
      </div>
    );
  };

  const getGridViewFilters = () => {
    if (!state.showFilters) {
      return null;
    }
    const filters =
      props.gridViewType === GridViewType.InMemory ? state.filters : state.availableFilters;
    if (SideFilterComponent) {
      return (
        <aside>
          <SideFilterComponent
            showFilters={state.showFilters}
            toggleFilters={onToggleFilter}
            filters={filters}
            onFilterChange={onFilterChange}
            onApplyFilters={
              state.gridViewType === GridViewType.ServerSide ? onApplyFilters : undefined
            }
          />
        </aside>
      );
    }
    return (
      <aside>
        <div className={classes.filtersHeader}>Filters</div>
        <GridFilters filters={state.filters || []} onFilterChange={onFilterChange} />
      </aside>
    );
  };

  const getGridViewFilterAsSidePanel = () => {
    const filters =
      props.gridViewType === GridViewType.InMemory ? state.filters : state.availableFilters;
    if (SideFilterComponent) {
      return (
        <SideFilterComponent
          showFilters={state.showFilters}
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
        showFilters={state.showFilters === true}
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

  const mergeClassNames = (classNames: (string | undefined)[]) =>
    classNames.filter((className) => !!className).join(' ');

  const gridContainerClass = props.gridContainerClass
    ? mergeClassNames([classes.gridView, props.gridContainerClass])
    : classes.gridView;

  if (!(state && state.gridViewType >= 0)) return null;
  return (
    <GridViewContext.Provider value={{ state, actions }}>
      <div className={gridContainerClass}>
        <div className={classes.gridViewtopSection}>
          {getQuickActionSection()}
          {getMessageSection()}
          {getSelectedFiltersSection()}
        </div>
        {props.isLoading ? <GridViewShimmer /> : <>{getGridViewSection()}</>}
      </div>
    </GridViewContext.Provider>
  );

  // #endregion "HTML Section"
};
