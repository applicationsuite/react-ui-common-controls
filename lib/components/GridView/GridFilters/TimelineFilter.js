import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Dropdown, DatePicker, Stack } from '@fluentui/react';
import { FilterDataType, FilterOperation, TimelineFilterType, QUATER_START_MONTH, QUATER_START_YEAR, TIME_LINE_FILTER_TYPE_MAP } from '../GridView.models';
import { MONTH_NAMES_SHORT } from '../../../';
import { GridFilterLabel } from './GridFilterLabel';
import { rangeFilterStyles } from './RangeFilter.styles';
const useStyles = createUseStyles(rangeFilterStyles);
export const TimeLineFilter = (props) => {
    const classes = useStyles();
    const stackTokens = { childrenGap: 20, padding: '0 0 0 6px' };
    const [timeline, setTimeLine] = React.useState(-1);
    React.useEffect(() => {
        setTimeLine(props.data.selectedTimeLine);
    }, []);
    const getQuaterLabel = (quaterKey, year, month, lastQuaterDay) => `${quaterKey} (${MONTH_NAMES_SHORT[month]} 1, ${year} - ${MONTH_NAMES_SHORT[month + 2]} ${lastQuaterDay}, ${year})`;
    const getTimeLineData = () => {
        let month = QUATER_START_MONTH;
        let year = QUATER_START_YEAR;
        const quaterList = Array();
        const quaters = [
            TimelineFilterType.Q1,
            TimelineFilterType.Q2,
            TimelineFilterType.Q3,
            TimelineFilterType.Q4
        ];
        quaters.forEach((item, index) => {
            const lastQuaterDay = new Date(year, month + 3, 0).getDate();
            const quater = {
                timeLineKey: item,
                timeLineLabel: getQuaterLabel(TIME_LINE_FILTER_TYPE_MAP[item], year, month, lastQuaterDay),
                startDate: new Date(year, month, 1, 0, 0, 0, 0),
                endDate: new Date(year, month + 2, lastQuaterDay, 0, 0, 0, 0)
            };
            quaterList.push(quater);
            month += 3;
            if (month === 12 || month === 11) {
                month = 0;
                year += 1;
            }
        });
        return quaterList;
    };
    const getTimeLineFilterOptions = () => {
        const timeLineData = getTimeLineData();
        const options = [];
        options.push({ key: -1, text: 'Any Time' });
        timeLineData.forEach((item) => {
            options.push({
                key: item.timeLineKey,
                text: item.timeLineLabel,
                data: item
            });
        });
        options.push({
            key: TimelineFilterType.Custom,
            text: TIME_LINE_FILTER_TYPE_MAP[TimelineFilterType.Custom]
        });
        return options;
    };
    const onFilterDataChange = (values, timlineType) => {
        const filter = Object.assign({}, props);
        filter.operation = FilterOperation.Between;
        filter.dataType = FilterDataType.Date;
        filter.data = filter.data || {};
        filter.data.selectedTimeLine = timlineType;
        filter.values = [...values];
        if (filter.values.length) {
            if (filter.values.length > 1) {
                filter.values = filter.values[0] || filter.values[1] ? filter.values : [];
            }
            else {
                filter.values = filter.values[0] ? filter.values : [];
            }
        }
        props.onFilterChange && props.onFilterChange(filter);
    };
    const getTimelineCustomFilter = (valueList) => {
        const values = valueList
            ? valueList.length
                ? valueList
                : new Array(2)
            : new Array(2);
        values[0] = values[0] ? new Date(values[0]) : values[0];
        if (valueList.length > 1) {
            values[1] = values[1] ? new Date(values[1]) : values[1];
        }
        return (_jsxs(Stack, Object.assign({ horizontal: true }, { children: [_jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(DatePicker, { value: values[0], onSelectDate: (date) => {
                            onFilterDataChange([date, values[1]], TimelineFilterType.Custom);
                        } }, void 0) }), void 0), _jsx("span", Object.assign({ className: classes.toText }, { children: "to" }), void 0), _jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(DatePicker, { value: values[1], onSelectDate: (date) => {
                            onFilterDataChange([values[0], date], TimelineFilterType.Custom);
                        } }, void 0) }), void 0)] }), void 0));
    };
    const onTimeLineFilterOptionChange = (selected) => {
        const value = selected ? +selected.key : -1;
        setTimeLine(value);
        if (value === -1) {
            onFilterDataChange([], value);
        }
        else {
            selected &&
                selected.data &&
                onFilterDataChange([selected.data.startDate, selected.data.endDate], value);
        }
    };
    return (_jsx("div", Object.assign({ className: "grid-filter" }, { children: _jsx(GridFilterLabel, Object.assign({ filterName: props.label, isFilterCollapsible: props.isCollapsible }, { children: _jsxs(Stack, Object.assign({ tokens: stackTokens }, { children: [_jsx(Dropdown, { options: getTimeLineFilterOptions(), selectedKey: timeline, onChange: (e, selected) => {
                            onTimeLineFilterOptionChange(selected);
                        } }, void 0), timeline === TimelineFilterType.Custom && getTimelineCustomFilter(props.values)] }), void 0) }), void 0) }), void 0));
};
