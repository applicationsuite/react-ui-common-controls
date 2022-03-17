import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ChoiceGroup } from '@fluentui/react/lib/ChoiceGroup';
import { TextField } from '@fluentui/react/lib/TextField';
import { createUseStyles } from 'react-jss';
import { FILTER_ITEM_TEXT_FIELD } from '../GridView.models';
import { GridFilterLabel } from './GridFilterLabel';
import { selectionFilterStyles } from './SelectionFilter.styles';
import { applyFilterTextByField } from '../GridViewUtils';
const useStyles = createUseStyles(selectionFilterStyles);
export const ToggleFilter = (props) => {
    const [filterText, setFilterText] = React.useState('');
    const [filterItems, setFilterItems] = React.useState([]);
    const [itemsChoiceGroup, setItemsChoiceGroup] = React.useState([]);
    React.useEffect(() => {
        setFilterItems(getItems(props.items) || []);
        setItemsChoiceGroup(getChoiceGroups(props.items));
    }, [props.items]);
    const classes = useStyles();
    const onFilterItemChange = (selectedOption) => {
        const filter = Object.assign({}, props);
        let items = filter.items || [];
        items = items.map((item) => (Object.assign({}, item)));
        items.forEach((item) => {
            item.selected = item.value === selectedOption.key;
        });
        filter.items = items;
        filter.values = items.filter((item) => item.selected === true).map((item) => item.value);
        props.onFilterChange && props.onFilterChange(filter);
    };
    const onFilterTextChange = (searchText) => {
        const items = applyFilterTextByField(searchText, props.items, FILTER_ITEM_TEXT_FIELD);
        setFilterText(searchText);
        setFilterItems(items);
        setItemsChoiceGroup(getChoiceGroups(items));
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
    const getChoiceGroups = (items = []) => {
        const options = items.map((item) => ({
            key: item.value,
            text: item.label || (item.label.toString && item.label.toString() === 'false')
                ? item.label.toString()
                : item.label
        }));
        return options;
    };
    if (!props.items)
        return null;
    if (props.items && props.items.length === 0) {
        return null;
    }
    return (_jsxs(GridFilterLabel, Object.assign({ filterName: props.label, isFilterCollapsible: props.isCollapsible }, { children: [props.itemsSearchRequired && (_jsx("div", Object.assign({ className: classes.filterTextBox }, { children: _jsx(TextField, { placeholder: "Filter", value: filterText, onChange: (e, value) => {
                        onFilterTextChange(value);
                    } }, void 0) }), void 0)), _jsx("div", Object.assign({ className: classes.accordianBody }, { children: itemsChoiceGroup.length > 0 && (_jsx(ChoiceGroup, { defaultSelectedKey: props.values[0], options: itemsChoiceGroup, onChange: (e, option) => {
                        onFilterItemChange(option);
                    } }, void 0)) }), void 0)] }), void 0));
};
