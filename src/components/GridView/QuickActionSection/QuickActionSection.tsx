import React, { FC, ReactElement, useMemo, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import {
  Callout,
  IContextualMenuItem,
  Stack,
  IStackTokens,
  IIconProps,
  DefaultButton,
  CommandButton
} from '@fluentui/react';
import { getQuickActionBarItems } from './helpers';
import useDimensions from './useDimension';
import { QuickSearch } from '../QuickSearch';
import { ColumnPicker } from '../ColumnPicker';
import { MultiColumnSort } from '../MultiColumnSort';
import { cloneDeep } from 'lodash';
import {
  IQuickActionSectionParams,
  IQucickActionSectionItem,
  IExportOptions,
  GridViewActionBarItems,
  IGridColumn,
  GridViewType
} from '../GridView.models';

import { quickActionSectionStyles } from './QuickActionSection.styles';

const useStyles = createUseStyles(quickActionSectionStyles);

export const QuickActionSection = (props: IQuickActionSectionParams) => {
  const classes = useStyles();
  const columnsButton = useRef(null);
  const quickActionSectionContainer = useRef(null);
  const [columnPickerDialog, toggleColumnPickerDialog] = React.useState(false);
  const columnsSortButton = useRef(null);
  const [columnSortDialog, toggleColumnSortDialog] = React.useState(false);

  const getExportProps = (exportOptions: IExportOptions[]) => {
    const exportItems: IContextualMenuItem[] = [];
    exportOptions.forEach((option) =>
      exportItems.push({
        key: option.fileType,
        text: option.fileType,
        iconProps: { iconName: option.iconName },
        onClick: (e, item) => {
          props.onExport && props.onExport(item?.key!);
        }
      })
    );
    return { items: exportItems };
  };

  const getGroupColumns = (gridColumns: IGridColumn[] = []) => {
    let columns = gridColumns;
    columns = columns.filter((item) => item.grouping === true);
    let columnMenus: IContextualMenuItem[] = [];
    columns.forEach((column) =>
      columnMenus.push({
        key: column.key,
        text: column.name,
        iconProps: { iconName: '' },
        onClick: (e, item) => {
          props.onGroupColumnChange && props.onGroupColumnChange(column);
        }
      })
    );
    if (columnMenus.length) {
      const defaultMenu: IContextualMenuItem = {
        key: 'Default',
        text: 'None',
        iconProps: { iconName: '' },
        onClick: () => {
          props.onGroupColumnChange && props.onGroupColumnChange(undefined);
        }
      };
      columnMenus = [defaultMenu].concat(columnMenus);
    }
    return { items: columnMenus };
  };

  const getRefreshButton = () =>
    props.onRefresh && (
      <div className={classes.quickActionColPicker}>
        <DefaultButton
          className={classes.borderlessButton}
          ariaLabel="Refresh"
          iconProps={{ iconName: 'Refresh' }}
          text="Refresh"
          onClick={props.onRefresh}
        />
      </div>
    );

  const getExportButton = () =>
    props.exportOptions &&
    props.onExport && (
      <div>
        <CommandButton
          className={`${classes.borderlessButton} ${classes.exportButton}`}
          ariaLabel="Export"
          iconProps={{ iconName: 'Export' }}
          disabled={!(props.selectedItems && props.selectedItems.length)}
          menuProps={getExportProps(props.exportOptions)}
          text="Export"
        />
      </div>
    );

  const getGroupColumnsButton = () =>
    props.allowGroupSelection &&
    getGroupColumns(props.columns!).items.length && (
      <div>
        <CommandButton
          className={`${classes.borderlessButton} ${classes.exportButton}`}
          ariaLabel={`Group by${props.groupColumn}` ? `: ${props.groupColumn}` : ''}
          iconProps={{ iconName: 'RowsGroup' }}
          menuProps={getGroupColumns(props.columns!)}
          text={`Group by${props.groupColumn ? `: ${props.groupColumn?.name}` : ''}`}
        />
      </div>
    );

  const getEditButton = () =>
    props.onEdit && (
      <div>
        <DefaultButton
          className={classes.borderlessButton}
          ariaLabel="Edit"
          iconProps={{ iconName: 'Edit' }}
          text="Edit"
          disabled={props.selectedItems ? props.selectedItems.length !== 1 : true}
          onClick={props.onEdit}
        />
      </div>
    );
  const getDeleteButton = () =>
    props.onDelete && (
      <div>
        <DefaultButton
          className={classes.borderlessButton}
          ariaLabel="Delete"
          iconProps={{ iconName: 'Delete' }}
          text="Delete"
          disabled={!(props.selectedItems && props.selectedItems.length)}
          onClick={props.onDelete}
        />
      </div>
    );

  const getColumnsButton = () => (
    <>
      {!props.hideColumnPicker && (
        <div className={classes.quickActionColPicker} ref={columnsButton}>
          <DefaultButton
            className={classes.borderlessButton}
            ariaLabel="Columns"
            iconProps={{ iconName: 'TripleColumn' }}
            text="Columns"
            onClick={() => {
              toggleColumnPickerDialog(!columnPickerDialog);
            }}
          />
        </div>
      )}
      {columnPickerDialog && props.columns && (
        <Callout
          className={classes.columnListCallout}
          role="dialog"
          target={columnsButton.current}
          gapSpace={0}
          setInitialFocus
          onDismiss={() => {
            toggleColumnPickerDialog(!columnPickerDialog);
          }}
        >
          <ColumnPicker columns={props.columns} onColumnChange={props.onColumnChange!} />
        </Callout>
      )}
    </>
  );

  const getFilterButton = () =>
    props.showFilters && (
      <div className={classes.quickActionFilter}>
        <DefaultButton
          className={classes.borderlessButton}
          ariaLabel="Filter"
          iconProps={{ iconName: 'Filter' }}
          text="Filter"
          onClick={() => {
            props.toggleFilters && props.toggleFilters(true);
          }}
        />
      </div>
    );

  const getQuickSearch = () =>
    props.showQuickSearch && (
      <div className={classes.quickActionSearch}>
        <QuickSearch
          value={props.searchText}
          placeHolderText={props.searchPlaceHolderText}
          onSearchTextChange={props.onSearchTextChange}
          quickSearchOnEnter={props.quickSearchOnEnter}
          hideSearchButton={props.hideQuickSearchButton}
        />
      </div>
    );

  const getSortButton = () => (
    <>
      {props.allowMultiLevelSorting && props.columns && (
        <div className={classes.quickActionColPicker} ref={columnsSortButton}>
          <DefaultButton
            className={classes.borderlessButton}
            ariaLabel="Sort"
            iconProps={{ iconName: 'Sort' }}
            text="Sort"
            onClick={() => {
              toggleColumnSortDialog(!columnSortDialog);
            }}
          />
        </div>
      )}
      {columnSortDialog && (
        <Callout
          className={classes.columnListCallout}
          role="dialog"
          target={columnsSortButton.current}
          gapSpace={0}
          setInitialFocus
          onDismiss={() => {
            toggleColumnSortDialog(!columnSortDialog);
          }}
        >
          <MultiColumnSort
            isInMemorySorting={props.gridViewType === GridViewType.InMemory}
            columns={props.columns!}
            sortingOptions={cloneDeep(props.sortingOptions!)}
            sortLevel={props.sortLevel}
            onSort={props.onSort}
            toggleSortButton={() => {
              toggleColumnSortDialog(!columnSortDialog);
            }}
          />
        </Callout>
      )}
    </>
  );

  const getCustomButton = (quickActionItem: IQucickActionSectionItem) => {
    return (
      <>
        <DefaultButton
          className={quickActionItem.className}
          ariaLabel={quickActionItem.label}
          iconProps={{ iconName: quickActionItem.icon }}
          text={quickActionItem.label}
          onClick={quickActionItem.onClick}
        />
      </>
    );
  };

  const actionBarAvailableItems = {
    [GridViewActionBarItems.Custom]: getCustomButton,
    [GridViewActionBarItems.RefreshButton]: getRefreshButton,
    [GridViewActionBarItems.ExportButton]: getExportButton,
    [GridViewActionBarItems.EditButton]: getEditButton,
    [GridViewActionBarItems.DeleteButton]: getDeleteButton,
    [GridViewActionBarItems.GroupColumnsButton]: getGroupColumnsButton,
    [GridViewActionBarItems.SortButton]: getSortButton,
    [GridViewActionBarItems.ColumnsButton]: getColumnsButton,
    [GridViewActionBarItems.FilterButton]: getFilterButton,
    [GridViewActionBarItems.SearchBox]: getQuickSearch
  };

  const getApplicableItems = () => {
    const applicableItems = [];
    if (props.onRefresh) {
      applicableItems.push(GridViewActionBarItems.RefreshButton);
    }
    if (props.onExport && props.exportOptions) {
      applicableItems.push(GridViewActionBarItems.ExportButton);
    }
    if (props.onDelete) {
      applicableItems.push(GridViewActionBarItems.DeleteButton);
    }
    if (props.onEdit) {
      applicableItems.push(GridViewActionBarItems.EditButton);
    }
    if (props.allowGroupSelection && getGroupColumns(props.columns!).items.length) {
      applicableItems.push(GridViewActionBarItems.GroupColumnsButton);
    }
    if (props.allowMultiLevelSorting) {
      applicableItems.push(GridViewActionBarItems.SortButton);
    }
    if (props.columns) {
      applicableItems.push(GridViewActionBarItems.ColumnsButton);
    }
    if (props.showFilters) {
      applicableItems.push(GridViewActionBarItems.FilterButton);
    }
    if (props.showQuickSearch) {
      applicableItems.push(GridViewActionBarItems.SearchBox);
    }
    return applicableItems;
  };

  const applicableItems = getApplicableItems();

  const containerSize = useDimensions(quickActionSectionContainer);

  const actionBarItems = getQuickActionBarItems(props.quickActionSectionItems, {
    applicableItems,
    actionBarAvailableItems,
    containerSize
  });

  const sectionStackTokens: IStackTokens = { childrenGap: 10 };

  return (
    <div ref={quickActionSectionContainer}>
      <Stack tokens={sectionStackTokens}>
        <Stack horizontal disableShrink horizontalAlign="space-between">
          <Stack>
            {actionBarItems && actionBarItems.actionBarLeftItems.length > 0 && (
              <Stack horizontal className={classes.quickActionSectionLeft}>
                {actionBarItems.actionBarLeftItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.onRender && item.onRender(item)}
                  </React.Fragment>
                ))}
              </Stack>
            )}
          </Stack>
          <Stack>
            {actionBarItems && actionBarItems.actionBarRightItems.length > 0 && (
              <Stack horizontal className={classes.quickActionSectionRight}>
                {actionBarItems.actionBarRightItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.onRender && item.onRender(item)}
                  </React.Fragment>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};
