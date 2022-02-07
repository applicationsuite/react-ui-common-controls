import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { FilterType } from '../GridView.models';
import { SelectionFilter } from './SelectionFilter';
import { RangeFilter } from './RangeFilter';
import { ToggleFilter } from './ToggleFilter';
import { TimeLineFilter } from './TimelineFilter';
import { gridFilterStyles } from './GridFilters.styles';
const useStyles = createUseStyles(gridFilterStyles);
export const GridFilters = (props) => {
    const { filters, onFilterChange } = props;
    const classes = useStyles();
    const renderSearchFilter = (filter) => {
        const mapper = {
            [FilterType.SelectionFilter]: () => (_jsx(SelectionFilter, Object.assign({}, filter, { onFilterChange: onFilterChange }), filter.id)),
            [FilterType.RangeFilter]: () => (_jsx(RangeFilter, Object.assign({}, filter, { onFilterChange: onFilterChange }), filter.id)),
            [FilterType.ToggleFilter]: () => (_jsx(ToggleFilter, Object.assign({}, filter, { onFilterChange: onFilterChange }), filter.id)),
            [FilterType.TimeLineFilter]: () => (_jsx(TimeLineFilter, Object.assign({}, filter, { onFilterChange: onFilterChange }), filter.id)),
            [FilterType.Custom]: () => {
                const CustomFilter = filter.FilterComponent;
                return CustomFilter ? (_jsx(CustomFilter, Object.assign({}, filter, { onFilterChange: onFilterChange }), filter.id)) : null;
            }
        };
        return mapper[filter.filterType]();
    };
    const getSectionSeparater = (filter, gridFilters, index) => {
        var _a;
        if ((filter.filterType === FilterType.SelectionFilter ||
            filter.filterType === FilterType.ToggleFilter) &&
            !((_a = filter.items) === null || _a === void 0 ? void 0 : _a.length)) {
            return null;
        }
        if (gridFilters.length - 1 !== index) {
            return _jsx("hr", { className: classes.filterDivider }, void 0);
        }
        return null;
    };
    return (_jsx("div", Object.assign({ className: classes.filterMain }, { children: filters &&
            filters.map((filter, index) => (_jsxs(React.Fragment, { children: [renderSearchFilter(filter), getSectionSeparater(filter, filters, index)] }, index))) }), void 0));
};
