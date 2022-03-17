import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { FilterOperation, FilterDataType } from '../GridView.models';
import { GridFilterLabel } from './GridFilterLabel';
import { rangeFilterStyles } from './RangeFilter.styles';
const useStyles = createUseStyles(rangeFilterStyles);
export const RangeFilter = (props) => {
    const classes = useStyles();
    const [operationType, setOperationType] = React.useState(FilterOperation.Equal);
    const stackTokens = { childrenGap: 12, padding: '0 0 0 6px' };
    React.useEffect(() => {
        setOperationType(props.operation || FilterOperation.Equal);
    }, []);
    const getRangeFilterOperations = (filterDataType) => {
        let options = [
            { key: FilterOperation.Equal, text: 'Equal to (=)' },
            {
                key: FilterOperation.GreaterThanEqual,
                text: 'Grater than equal To (>=)'
            },
            {
                key: FilterOperation.LessThanEqual,
                text: 'Less than equal to (<=)'
            },
            { key: FilterOperation.Between, text: 'Between' }
        ];
        if (filterDataType === FilterDataType.String) {
            options = options.filter((option) => option.key === FilterOperation.Equal);
        }
        return options;
    };
    const onFilterDataChange = (values, fieldDataType = FilterDataType.String, operation) => {
        const filter = Object.assign({}, props);
        filter.operation = operation > -1 ? operation : operationType;
        filter.dataType = fieldDataType;
        filter.values = [...values];
        if (filter.values.length) {
            if (filter.values.length > 1) {
                filter.values = filter.values[0] || filter.values[1] ? filter.values : [];
                if (filter.operation !== FilterOperation.Between) {
                    filter.values = [filter.values[0]];
                }
            }
            else {
                filter.values = filter.values[0] ? filter.values : [];
            }
        }
        props.onFilterChange && props.onFilterChange(filter);
    };
    const getSingleFilter = (fieldType) => {
        const values = props.values ? (props.values.length ? props.values : ['']) : [''];
        const mapper = {
            [FilterDataType.String]: () => (_jsx(TextField, { placeholder: "Value", value: values[0], onChange: (e, value) => {
                    onFilterDataChange([value], fieldType);
                } }, void 0)),
            [FilterDataType.Number]: () => (_jsx(TextField, { type: "number", placeholder: "Value", value: values[0], onChange: (e, value) => {
                    onFilterDataChange([+value], fieldType);
                } }, void 0)),
            [FilterDataType.Date]: () => {
                values[0] = values[0] ? new Date(values[0]) : values[0];
                return (_jsx(DatePicker, { value: values[0], onSelectDate: (date) => {
                        onFilterDataChange([date], fieldType);
                    } }, void 0));
            },
            [FilterDataType.Boolean]: () => _jsx(_Fragment, {}, void 0)
        };
        return mapper[fieldType]();
    };
    const getRangeFilter = (fieldType) => {
        const values = props.values ? (props.values.length ? props.values : ['', '']) : ['', ''];
        const mapper = {
            [FilterDataType.String]: () => (_jsxs(Stack, Object.assign({ horizontal: true }, { children: [_jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(TextField, { placeholder: "Starting Value", value: values[0], onChange: (e, value) => {
                                onFilterDataChange([value, values[1]], fieldType);
                            } }, void 0) }), void 0), _jsx("span", Object.assign({ className: classes.toText }, { children: "to" }), void 0), _jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(TextField, { placeholder: "Ending Value", value: values[1], onChange: (e, value) => {
                                onFilterDataChange([values[0], value], fieldType);
                            } }, void 0) }), void 0)] }), void 0)),
            [FilterDataType.Number]: () => (_jsxs(Stack, Object.assign({ horizontal: true }, { children: [_jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(TextField, { placeholder: "Starting Value", value: values[0], onChange: (e, value) => {
                                onFilterDataChange([value, values[1]], fieldType);
                            } }, void 0) }), void 0), _jsx("span", Object.assign({ className: classes.toText }, { children: "to" }), void 0), _jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(TextField, { placeholder: "Ending Value", value: values[1], onChange: (e, value) => {
                                onFilterDataChange([values[0], value], fieldType);
                            } }, void 0) }), void 0)] }), void 0)),
            [FilterDataType.Date]: () => {
                values[0] = values[0] ? new Date(values[0]) : values[0];
                if (values.length > 1) {
                    values[1] = values[1] ? new Date(values[1]) : values[1];
                }
                return (_jsxs(Stack, Object.assign({ horizontal: true }, { children: [_jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(DatePicker, { value: values[0], onSelectDate: (date) => {
                                    onFilterDataChange([date, values[1]], fieldType);
                                } }, void 0) }), void 0), _jsx("span", Object.assign({ className: classes.toText }, { children: "to" }), void 0), _jsx(Stack.Item, Object.assign({ grow: true }, { children: _jsx(DatePicker, { value: values[1], onSelectDate: (date) => {
                                    onFilterDataChange([values[0], date], fieldType);
                                } }, void 0) }), void 0)] }), void 0));
            },
            [FilterDataType.Boolean]: () => _jsx(_Fragment, {}, void 0)
        };
        return mapper[fieldType]();
    };
    const getFieldsByOperationAndFieldType = (filterOperationType, fieldType) => {
        const mapper = {
            [FilterOperation.Equal]: getSingleFilter,
            [FilterOperation.GreaterThanEqual]: getSingleFilter,
            [FilterOperation.LessThanEqual]: getSingleFilter,
            [FilterOperation.Between]: getRangeFilter
        };
        return mapper[filterOperationType](fieldType);
    };
    const onRangeFilterTypeChange = (selected) => {
        selected && setOperationType(+selected.key);
        if (selected && props.values) {
            onFilterDataChange(props.values, props.dataType, +selected.key);
        }
    };
    return (_jsx("div", Object.assign({ className: "grid-filter" }, { children: _jsx(GridFilterLabel, Object.assign({ filterName: props.label, isFilterCollapsible: props.isCollapsible }, { children: _jsxs(Stack, Object.assign({ tokens: stackTokens }, { children: [_jsx(Dropdown, { options: getRangeFilterOperations(props.dataType || FilterDataType.String), selectedKey: operationType, onChange: (e, selected) => {
                            onRangeFilterTypeChange(selected);
                        } }, void 0), getFieldsByOperationAndFieldType(operationType, props.dataType || FilterDataType.String)] }), void 0) }), void 0) }), void 0));
};
