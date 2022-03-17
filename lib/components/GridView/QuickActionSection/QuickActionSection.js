import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { Callout } from '@fluentui/react/lib/Callout';
import { Stack } from '@fluentui/react/lib/Stack';
import { DefaultButton, CommandButton } from '@fluentui/react/lib/Button';
import { getQuickActionBarItems } from './helpers';
import useDimensions from './useDimension';
import { QuickSearch } from '../QuickSearch';
import { ColumnPicker } from '../ColumnPicker';
import { MultiColumnSort } from '../MultiColumnSort';
import { cloneDeep } from 'lodash';
import { GridViewActionBarItems, GridViewType } from '../GridView.models';
import { quickActionSectionStyles } from './QuickActionSection.styles';
const useStyles = createUseStyles(quickActionSectionStyles);
export const QuickActionSection = (props) => {
    const classes = useStyles();
    const columnsButton = useRef(null);
    const quickActionSectionContainer = useRef(null);
    const [columnPickerDialog, toggleColumnPickerDialog] = React.useState(false);
    const columnsSortButton = useRef(null);
    const [columnSortDialog, toggleColumnSortDialog] = React.useState(false);
    const getExportProps = (exportOptions) => {
        const exportItems = [];
        exportOptions.forEach((option) => exportItems.push({
            key: option.fileType,
            text: option.fileType,
            iconProps: { iconName: option.iconName },
            onClick: (e, item) => {
                props.onExport && props.onExport(item === null || item === void 0 ? void 0 : item.key);
            }
        }));
        return { items: exportItems };
    };
    const getGroupColumns = (gridColumns = []) => {
        let columns = gridColumns;
        columns = columns.filter((item) => item.grouping === true);
        let columnMenus = [];
        columns.forEach((column) => columnMenus.push({
            key: column.key,
            text: column.name,
            iconProps: { iconName: '' },
            onClick: (e, item) => {
                props.onGroupColumnChange && props.onGroupColumnChange(column);
            }
        }));
        if (columnMenus.length) {
            const defaultMenu = {
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
    const getRefreshButton = () => props.onRefresh && (_jsx("div", Object.assign({ className: classes.quickActionColPicker }, { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Refresh", iconProps: { iconName: 'Refresh' }, text: "Refresh", onClick: props.onRefresh }, void 0) }), void 0));
    const getExportButton = () => props.exportOptions &&
        props.onExport && (_jsx("div", { children: _jsx(CommandButton, { className: `${classes.borderlessButton} ${classes.exportButton}`, ariaLabel: "Export", iconProps: { iconName: 'Export' }, disabled: !(props.selectedItems && props.selectedItems.length), menuProps: getExportProps(props.exportOptions), text: "Export" }, void 0) }, void 0));
    const getGroupColumnsButton = () => {
        var _a;
        return props.allowGroupSelection &&
            getGroupColumns(props.columns).items.length && (_jsx("div", { children: _jsx(CommandButton, { className: `${classes.borderlessButton} ${classes.exportButton}`, ariaLabel: `Group by${props.groupColumn}` ? `: ${props.groupColumn}` : '', iconProps: { iconName: 'RowsGroup' }, menuProps: getGroupColumns(props.columns), text: `Group by${props.groupColumn ? `: ${(_a = props.groupColumn) === null || _a === void 0 ? void 0 : _a.name}` : ''}` }, void 0) }, void 0));
    };
    const getEditButton = () => props.onEdit && (_jsx("div", { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Edit", iconProps: { iconName: 'Edit' }, text: "Edit", disabled: props.selectedItems ? props.selectedItems.length !== 1 : true, onClick: props.onEdit }, void 0) }, void 0));
    const getSaveButton = () => props.onSave && (_jsx("div", { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Save", iconProps: { iconName: 'Save' }, text: "Save", 
            // disabled={props.selectedItems ? props.selectedItems.length !== 1 : true}
            onClick: props.onSave }, void 0) }, void 0));
    const getCancelButton = () => props.onCancel && (_jsx("div", { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Cancel", iconProps: { iconName: 'Cancel' }, text: "Cancel", 
            // disabled={props.selectedItems ? props.selectedItems.length !== 1 : true}
            onClick: props.onCancel }, void 0) }, void 0));
    const getDeleteButton = () => props.onDelete && (_jsx("div", { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Delete", iconProps: { iconName: 'Delete' }, text: "Delete", disabled: !(props.selectedItems && props.selectedItems.length), onClick: props.onDelete }, void 0) }, void 0));
    const getColumnsButton = () => (_jsxs(_Fragment, { children: [!props.hideColumnPicker && (_jsx("div", Object.assign({ className: classes.quickActionColPicker, ref: columnsButton }, { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Columns", iconProps: { iconName: 'TripleColumn' }, text: "Columns", onClick: () => {
                        toggleColumnPickerDialog(!columnPickerDialog);
                    } }, void 0) }), void 0)), columnPickerDialog && props.columns && (_jsx(Callout, Object.assign({ className: classes.columnListCallout, role: "dialog", target: columnsButton.current, gapSpace: 0, setInitialFocus: true, onDismiss: () => {
                    toggleColumnPickerDialog(!columnPickerDialog);
                } }, { children: _jsx(ColumnPicker, { columns: props.columns, onColumnChange: props.onColumnChange }, void 0) }), void 0))] }, void 0));
    const getFilterButton = () => props.showFilters && (_jsx("div", Object.assign({ className: classes.quickActionFilter }, { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Filter", iconProps: { iconName: 'Filter' }, text: "Filter", onClick: () => {
                props.toggleFilters && props.toggleFilters(true);
            } }, void 0) }), void 0));
    const getQuickSearch = () => props.showQuickSearch && (_jsx("div", Object.assign({ className: classes.quickActionSearch }, { children: _jsx(QuickSearch, { value: props.searchText, placeHolderText: props.searchPlaceHolderText, onSearchTextChange: props.onSearchTextChange, quickSearchOnEnter: props.quickSearchOnEnter, hideSearchButton: props.hideQuickSearchButton }, void 0) }), void 0));
    const getSortButton = () => (_jsxs(_Fragment, { children: [props.allowMultiLevelSorting && props.columns && (_jsx("div", Object.assign({ className: classes.quickActionColPicker, ref: columnsSortButton }, { children: _jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Sort", iconProps: { iconName: 'Sort' }, text: "Sort", onClick: () => {
                        toggleColumnSortDialog(!columnSortDialog);
                    } }, void 0) }), void 0)), columnSortDialog && (_jsx(Callout, Object.assign({ className: classes.columnListCallout, role: "dialog", target: columnsSortButton.current, gapSpace: 0, setInitialFocus: true, onDismiss: () => {
                    toggleColumnSortDialog(!columnSortDialog);
                } }, { children: _jsx(MultiColumnSort, { isInMemorySorting: props.gridViewType === GridViewType.InMemory, columns: props.columns, sortingOptions: cloneDeep(props.sortingOptions), sortLevel: props.sortLevel, onSort: props.onSort, toggleSortButton: () => {
                        toggleColumnSortDialog(!columnSortDialog);
                    } }, void 0) }), void 0))] }, void 0));
    const getCustomButton = (quickActionItem) => {
        return (_jsx(_Fragment, { children: _jsx(DefaultButton, { className: quickActionItem.className, ariaLabel: quickActionItem.label, iconProps: { iconName: quickActionItem.icon }, text: quickActionItem.label, onClick: quickActionItem.onClick }, void 0) }, void 0));
    };
    const actionBarAvailableItems = {
        [GridViewActionBarItems.Custom]: getCustomButton,
        [GridViewActionBarItems.RefreshButton]: getRefreshButton,
        [GridViewActionBarItems.ExportButton]: getExportButton,
        [GridViewActionBarItems.EditButton]: getEditButton,
        [GridViewActionBarItems.SaveButton]: getSaveButton,
        [GridViewActionBarItems.CancelButton]: getCancelButton,
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
        if (props.onSave) {
            applicableItems.push(GridViewActionBarItems.SaveButton);
        }
        if (props.onCancel) {
            applicableItems.push(GridViewActionBarItems.CancelButton);
        }
        if (props.allowGroupSelection && getGroupColumns(props.columns).items.length) {
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
    const sectionStackTokens = { childrenGap: 10 };
    return (_jsx("div", Object.assign({ ref: quickActionSectionContainer }, { children: _jsx(Stack, Object.assign({ tokens: sectionStackTokens }, { children: _jsxs(Stack, Object.assign({ horizontal: true, disableShrink: true, horizontalAlign: "space-between" }, { children: [_jsx(Stack, { children: actionBarItems && actionBarItems.actionBarLeftItems.length > 0 && (_jsx(Stack, Object.assign({ horizontal: true, className: classes.quickActionSectionLeft }, { children: actionBarItems.actionBarLeftItems.map((item, index) => (_jsx(React.Fragment, { children: item.onRender && item.onRender(item) }, index))) }), void 0)) }, void 0), _jsx(Stack, { children: actionBarItems && actionBarItems.actionBarRightItems.length > 0 && (_jsx(Stack, Object.assign({ horizontal: true, className: classes.quickActionSectionRight }, { children: actionBarItems.actionBarRightItems.map((item, index) => (_jsx(React.Fragment, { children: item.onRender && item.onRender(item) }, index))) }), void 0)) }, void 0)] }), void 0) }), void 0) }), void 0));
};
