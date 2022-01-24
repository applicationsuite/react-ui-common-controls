import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { multiColumnSortStyles } from './MultiColumnSort.styles';
import { Stack, PrimaryButton, DefaultButton, Dropdown } from '@fluentui/react';
const useStyles = createUseStyles(multiColumnSortStyles);
export const MultiColumnSort = (props) => {
    const classes = useStyles();
    const [sortingOptions, setSortingOptions] = React.useState([]);
    React.useEffect(() => {
        setSortingOptions(props.sortingOptions || []);
    }, [props.sortingOptions]);
    const sortLevel = props.sortLevel || 1;
    const columns = props.columns.filter((col) => col.disableSort !== true);
    const getSortColumns = (index) => {
        let sortOption = sortingOptions && sortingOptions[index];
        let filteredSortOptions = sortingOptions;
        filteredSortOptions = sortOption
            ? sortingOptions.filter((item) => item.sortColumn !== sortOption.sortColumn)
            : filteredSortOptions;
        const options = [];
        columns.forEach((item) => {
            if (!filteredSortOptions.find((i) => i.sortColumn === item.key)) {
                options.push({
                    key: item.key,
                    text: item.name,
                    data: item
                });
            }
        });
        return options;
    };
    const getColumnOrder = () => {
        const options = [];
        options.push({
            key: 'asc',
            text: 'Ascending'
        });
        options.push({
            key: 'desc',
            text: 'Descending'
        });
        return options;
    };
    const onSortColumnChange = (item, index) => {
        let sortOption = sortingOptions && sortingOptions[index];
        if (sortOption) {
            sortOption.sortColumn = item.key;
            sortOption.sortField = item.data.fieldName;
            sortOption.sortType = sortOption.sortType || 'asc';
        }
        else {
            sortOption = {
                sortColumn: item.key,
                sortField: item.data.fieldName,
                sortType: 'asc'
            };
            sortingOptions.push(sortOption);
        }
        setSortingOptions([...sortingOptions]);
        props.isInMemorySorting && props.onSort && props.onSort(sortingOptions);
    };
    const onSortOrderChange = (item, index) => {
        let sortOption = sortingOptions && sortingOptions[index];
        if (!sortOption) {
            return;
        }
        sortOption.sortType = item.key;
        setSortingOptions([...sortingOptions]);
        props.isInMemorySorting && props.onSort && props.onSort(sortingOptions);
    };
    const onApplySorting = () => {
        props.toggleSortButton && props.toggleSortButton();
        props.onSort && props.onSort(sortingOptions);
    };
    const onCancel = () => {
        props.toggleSortButton && props.toggleSortButton();
    };
    const onClearSorting = () => {
        props.toggleSortButton && props.toggleSortButton();
        props.onSort && props.onSort([]);
    };
    const getColumnsToSort = () => {
        return [...Array(sortLevel)].map((item, index) => {
            const sortOption = sortingOptions && sortingOptions[index];
            return (_jsxs(Stack, Object.assign({ horizontal: true }, { children: [_jsx(Stack.Item, Object.assign({ grow: true, className: classes.columnSection }, { children: _jsx(Dropdown, { className: classes.columnField, selectedKey: sortOption ? sortOption.sortColumn : -1, ariaLabel: "Column", options: getSortColumns(index), onChange: (e, selected) => {
                                onSortColumnChange(selected, index);
                            } }, void 0) }), void 0), _jsx(Stack.Item, Object.assign({ grow: true, className: classes.orderSection }, { children: _jsx(Dropdown, { disabled: sortOption ? false : true, className: classes.orderField, selectedKey: sortOption ? sortOption.sortType : -1, ariaLabel: "Order", options: getColumnOrder(), onChange: (e, selected) => {
                                onSortOrderChange(selected, index);
                            } }, void 0) }), void 0)] }), index));
        });
    };
    return (_jsxs("div", Object.assign({ className: classes.columnsSortContainer }, { children: [_jsxs(Stack, Object.assign({ horizontal: true }, { children: [_jsx(Stack.Item, Object.assign({ grow: true, className: classes.columnSectionHeader }, { children: "Column" }), void 0), _jsx(Stack.Item, Object.assign({ grow: true, className: classes.orderSectionHeader }, { children: "Order" }), void 0)] }), void 0), getColumnsToSort(), _jsxs(Stack, Object.assign({ horizontal: true }, { children: [_jsx(Stack.Item, Object.assign({ grow: true, className: classes.footerLeftBtns }, { children: _jsx(DefaultButton, { className: classes.resetButton, ariaLabel: "Reset", iconProps: { iconName: "RevToggleKey" }, text: "Reset", onClick: onClearSorting }, void 0) }), void 0), _jsx(Stack.Item, Object.assign({ grow: true, className: classes.footerRightBtns }, { children: !props.isInMemorySorting && (_jsxs("div", { children: [_jsx(PrimaryButton, Object.assign({ onClick: onApplySorting }, { children: "Apply" }), void 0), _jsx(DefaultButton, { text: 'Cancel', onClick: onCancel, className: classes.cancelButton }, void 0)] }, void 0)) }), void 0)] }), void 0)] }), void 0));
};
