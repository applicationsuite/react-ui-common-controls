import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { FocusZone } from '@fluentui/react/lib/FocusZone';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { columnPickerStyles } from './ColumnPicker.styles';
const useStyles = createUseStyles(columnPickerStyles);
export const ColumnPicker = (props) => {
    const classes = useStyles();
    const { columns, onColumnChange } = props;
    const handleChange = (e, column) => {
        if (isLastColumn() && column.selected) {
            return;
        }
        const cols = columns;
        const selectedColumn = cols.find((col) => col.key === column.key);
        if (selectedColumn) {
            selectedColumn.selected = !selectedColumn.selected;
        }
        onColumnChange([...cols]);
    };
    const isLastColumn = () => columns.filter((item) => item.selected).length === 1;
    const onSelectAllChange = (e, checked) => {
        const cols = columns;
        cols.forEach((column) => {
            if (!column.required)
                column.selected = checked;
        });
        onColumnChange([...cols]);
    };
    const onFocus = (disableSelctAll) => { };
    const selectAllCheckUncheck = () => columns.length === columns.filter((item) => item.selected).length;
    const selectAllCheckForIsAnyRequired = () => columns.filter((item) => item.required).length > 0;
    const renderColumn = (column, index) => (_jsx("div", Object.assign({ className: classes.columnNameText }, { children: _jsx(Checkbox, { ariaLabel: column.name, label: column.name, checked: column.selected, disabled: column.required || (column.selected && isLastColumn()), onChange: (e) => handleChange(e, column) }, void 0) }), column.name));
    const selctAll = selectAllCheckUncheck();
    const disabledAllChk = selectAllCheckForIsAnyRequired();
    return (_jsx(FocusZone, Object.assign({ isCircularNavigation: true }, { children: _jsxs("div", Object.assign({ className: classes.columnPickerList }, { children: [_jsx("div", Object.assign({ className: classes.selectAllOption }, { children: _jsx(Checkbox, { ariaLabel: "Select All", onChange: onSelectAllChange, checked: selctAll, disabled: disabledAllChk ? false : selctAll, label: "Select All" }, void 0) }), void 0), columns && columns.map((column, index) => renderColumn(column, index)), _jsx("div", { onFocus: () => onFocus(selctAll) }, void 0)] }), void 0) }), void 0));
};
