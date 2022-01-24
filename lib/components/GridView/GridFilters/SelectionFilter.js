import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { TextField, Checkbox } from '@fluentui/react';
import { FILTER_ITEM_TEXT_FIELD } from '../GridView.models';
import { GridFilterLabel } from './GridFilterLabel';
import { selectionFilterStyles } from './SelectionFilter.styles';
import { applyFilterTextByField } from '../GridViewUtils';
const useStyles = createUseStyles(selectionFilterStyles);
export const SelectionFilter = (props) => {
    var _a, _b;
    const classes = useStyles();
    const [filterText, setFilterText] = React.useState('');
    const [filterItems, setFilterItems] = React.useState([]);
    React.useEffect(() => {
        setFilterItems(getItems(props.items) || []);
    }, [props.items]);
    const onFilterItemChange = (filterItem, isSelected) => {
        const items = props.items || [];
        items.forEach((item) => {
            var _a;
            item.selected =
                item.value === filterItem.value ? isSelected : (_a = props.values) === null || _a === void 0 ? void 0 : _a.includes(item.value);
        });
        const filter = Object.assign({}, props);
        filter.values = items.filter((item) => item.selected === true).map((item) => item.value);
        props.onFilterChange && props.onFilterChange(filter);
    };
    const onFilterTextChange = (searchText) => {
        const items = applyFilterTextByField(searchText, props.items, FILTER_ITEM_TEXT_FIELD);
        setFilterText(searchText);
        setFilterItems(items);
    };
    const getItems = (items = []) => {
        var _a;
        const values = (_a = props.values) === null || _a === void 0 ? void 0 : _a.filter((value) => !items.find((item) => item.value === value));
        values === null || values === void 0 ? void 0 : values.forEach((value) => {
            items.push({
                value,
                label: value,
                selected: true
            });
        });
        return items;
    };
    const onSelectAll = (checked) => {
        const items = filterItems || [];
        items.forEach((item) => {
            item.selected = checked;
        });
        const filter = Object.assign({}, props);
        filter.items = filter.items || [];
        filter.values = checked ? filter.items.map((item) => item.value) : [];
        props.onFilterChange && props.onFilterChange(filter);
    };
    if (!props.items)
        return null;
    if (props.items && props.items.length === 0) {
        return null;
    }
    return (_jsxs(GridFilterLabel, Object.assign({ filterName: props.label, isFilterCollapsible: props.isCollapsible }, { children: [props.itemsSearchRequired && (_jsx("div", Object.assign({ className: classes.filterTextBox }, { children: _jsx(TextField, { placeholder: "Filter", value: filterText, onChange: (e, value) => {
                        onFilterTextChange(value);
                    } }, void 0) }), void 0)), _jsxs("div", Object.assign({ className: classes.accordianBody }, { children: [!props.hideSelectAll && filterItems && filterItems.length > 0 && (_jsx(Checkbox, { ariaLabel: "Select All", label: "Select All", className: classes.selectAllCheckBox, checked: ((_a = props.values) === null || _a === void 0 ? void 0 : _a.length) === ((_b = props.items) === null || _b === void 0 ? void 0 : _b.length), onChange: (e, checked) => {
                            onSelectAll(checked);
                        } }, void 0)), filterItems.map((item, index) => {
                        var _a;
                        return (_jsx("div", { children: _jsx("div", Object.assign({ className: classes.selectionFilters }, { children: _jsx(Checkbox, { ariaLabel: `${item.label} ${item.count ? item.count : ''}`, label: `${item.label} ${item.count ? `(${item.count})` : ''}`, disabled: item.count === 0, checked: (_a = props.values) === null || _a === void 0 ? void 0 : _a.includes(item.value), onRenderLabel: item.onRenderLabel, onChange: (e, checked) => {
                                        onFilterItemChange(item, checked);
                                    } }, void 0) }), void 0) }, index));
                    })] }), void 0)] }), void 0));
};
