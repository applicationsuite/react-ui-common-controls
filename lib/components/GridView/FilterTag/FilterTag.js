import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import * as React from 'react';
import { Link, Callout, PrimaryButton, DefaultButton, Icon } from '@fluentui/react';
import { cloneDeep } from 'lodash';
import { filterTagStyles } from './FilterTag.styles';
import { FilterOperation, FilterDataType, FilterType, OPERATIONS_STRINGS_MAP, OPERATIONS_DATE_STRINGS_MAP } from '../GridView.models';
import { getFormattedValue } from '../GridViewUtils';
import { GridFilters } from '../GridFilters';
const useStyles = createUseStyles(filterTagStyles);
export const FilterTags = (props) => {
    const classes = useStyles();
    if (!(props.filters && props.filters.length > 0)) {
        return null;
    }
    return (_jsxs("div", Object.assign({ className: classes.filterContainer }, { children: [_jsxs("span", Object.assign({ className: classes.filterText }, { children: [_jsx(Icon, { iconName: "Filter", className: "filter-css" }, void 0), _jsx("span", Object.assign({ className: classes.filterCss }, { children: "Filters:" }), void 0)] }), void 0), props.filters &&
                props.filters.map((filter) => (_jsx(FilterTag, Object.assign({}, filter, { maxFilterTagLength: props.maxFilterTagLength, onRemoveFilter: props.onRemoveFilter, onApplyFilter: props.onApplyFilter, onChangeFilter: props.onChangeFilter }), filter.id))), props.onClearFilters && (_jsx(DefaultButton, { className: classes.borderlessButton, ariaLabel: "Clear Filters", iconProps: { iconName: 'ClearFilter' }, text: "Clear Filters", onClick: props.onClearFilters }, void 0))] }), void 0));
};
export const FilterTag = (filter) => {
    const classes = useStyles();
    const [filterDialog, toggleFilterDialog] = React.useState(false);
    const filterButton = React.useRef(null);
    const [filterData, setFilterData] = React.useState();
    const rangeValues = {
        filterValueStart: filter.values.length ? filter.values[0] : undefined,
        filterValueEnd: filter.values.length && filter.values.length > 1 ? filter.values[1] : undefined
    };
    const onToggleFilterDialog = () => {
        if (filter.onApplyFilter) {
            setFilterData(cloneDeep(filter));
        }
        toggleFilterDialog(true);
    };
    const renderFilterValues = (gridFilter) => {
        var _a, _b, _c, _d;
        if (gridFilter.operation !== FilterOperation.Between) {
            let formattedValues = [];
            if (filter.filterType === FilterType.SelectionFilter ||
                filter.filterType === FilterType.ToggleFilter) {
                if (((_a = filter.items) === null || _a === void 0 ? void 0 : _a.length) === ((_b = filter.values) === null || _b === void 0 ? void 0 : _b.length)) {
                    formattedValues.push('All');
                }
                else {
                    const filterItems = (_c = gridFilter.items) === null || _c === void 0 ? void 0 : _c.filter((item) => gridFilter.values.includes(item.value));
                    const maxValueLength = filter.maxFilterTagLength || (filterItems === null || filterItems === void 0 ? void 0 : filterItems.length);
                    formattedValues = filterItems
                        ? filterItems.slice(0, maxValueLength).map((item) => getFormattedValue(item.label))
                        : [];
                    const remainingItems = (filterItems === null || filterItems === void 0 ? void 0 : filterItems.length) - formattedValues.length;
                    if (remainingItems > 0) {
                        formattedValues.push(`...+${remainingItems}`);
                    }
                }
            }
            else {
                formattedValues = (_d = gridFilter.values) === null || _d === void 0 ? void 0 : _d.map((item) => getFormattedValue(item));
            }
            // gridFilter.values = gridFilter.values || [];
            return (_jsxs(_Fragment, { children: [_jsx("span", Object.assign({ className: classes.filterTagVal }, { children: OPERATIONS_STRINGS_MAP[gridFilter.operation]
                            ? gridFilter.dataType === FilterDataType.Date
                                ? OPERATIONS_DATE_STRINGS_MAP[gridFilter.operation]
                                : OPERATIONS_STRINGS_MAP[gridFilter.operation]
                            : '' }), void 0), _jsx("span", Object.assign({ className: classes.filterTagVal }, { children: formattedValues.join(', ') }), void 0)] }, void 0));
        }
        const formattedStartValue = getFormattedValue(rangeValues.filterValueStart);
        const formattedEndValue = getFormattedValue(rangeValues.filterValueEnd);
        return (_jsxs(_Fragment, { children: [_jsx(_Fragment, { children: _jsx("span", Object.assign({ className: classes.filterTagVal }, { children: rangeValues.filterValueStart && rangeValues.filterValueEnd
                            ? ''
                            : rangeValues.filterValueStart
                                ? gridFilter.dataType === FilterDataType.Date
                                    ? OPERATIONS_DATE_STRINGS_MAP[FilterOperation.GreaterThanEqual]
                                    : OPERATIONS_STRINGS_MAP[FilterOperation.GreaterThanEqual]
                                : rangeValues.filterValueEnd
                                    ? gridFilter.dataType === FilterDataType.Date
                                        ? OPERATIONS_DATE_STRINGS_MAP[FilterOperation.LessThanEqual]
                                        : OPERATIONS_STRINGS_MAP[FilterOperation.LessThanEqual]
                                    : '' }), void 0) }, void 0), _jsx("span", Object.assign({ className: classes.filterTagVal }, { children: formattedStartValue || '' }), void 0), formattedStartValue && formattedEndValue && (_jsx("span", Object.assign({ className: classes.filterTagVal }, { children: " to " }), void 0)), _jsx("span", Object.assign({ className: classes.filterTagVal }, { children: formattedEndValue || '' }), void 0)] }, void 0));
    };
    const onChangeFilter = (gridFilter) => {
        if (filter.onApplyFilter) {
            setFilterData(gridFilter);
        }
        else {
            filter.onChangeFilter && filter.onChangeFilter(gridFilter);
        }
    };
    const onApplyFilter = () => {
        filter.onApplyFilter && filter.onApplyFilter(filterData);
        toggleFilterDialog(false);
        setFilterData(undefined);
    };
    const onCancel = () => {
        toggleFilterDialog(false);
        setFilterData(undefined);
    };
    const filterInfo = filter.onApplyFilter ? filterData : filter;
    const filters = filterInfo ? [Object.assign(Object.assign({}, filterInfo), { isCollapsible: false })] : [];
    return (_jsxs(_Fragment, { children: [_jsxs("div", Object.assign({ className: classes.filterTags }, { children: [_jsx("div", Object.assign({ ref: filterButton }, { children: _jsxs(Link, Object.assign({ className: classes.filterDetails, onClick: () => {
                                onToggleFilterDialog();
                            } }, { children: [_jsxs("span", { children: [filter.label, ":"] }, void 0), renderFilterValues(filter)] }), void 0) }), void 0), !filter.isNonRemovable && (_jsx("button", Object.assign({ className: classes.filterTagsClose, id: filter.id, type: "button", onClick: () => {
                            filter.onRemoveFilter && filter.onRemoveFilter(filter.id);
                        } }, { children: _jsx(Icon, { iconName: "Clear" }, void 0) }), void 0))] }), void 0), filterDialog && filter && (_jsxs(Callout, Object.assign({ className: classes.filterDialog, role: "dialog", target: filterButton.current, gapSpace: 0, setInitialFocus: true, onDismiss: () => {
                    toggleFilterDialog(!filterDialog);
                } }, { children: [_jsx(GridFilters, { filters: filters, onFilterChange: onChangeFilter }, void 0), filter.onApplyFilter && (_jsxs("div", { children: [_jsx(PrimaryButton, Object.assign({ onClick: onApplyFilter, className: classes.applyBtn }, { children: "Apply" }), void 0), _jsx(DefaultButton, { text: 'Cancel', onClick: onCancel }, void 0)] }, void 0))] }), void 0))] }, void 0));
};
