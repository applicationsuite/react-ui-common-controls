import { jsx as _jsx } from "react/jsx-runtime";
import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { mergeClassNames } from '../../utilities/mergeClassNames';
import { createUseStyles } from 'react-jss';
import { gridViewStyles } from './GridView.styles';
const useStyles = createUseStyles(gridViewStyles);
export const GridViewDefault = (props) => {
    const classes = useStyles();
    const detailListClassName = mergeClassNames([classes.listStyles, props.detailsListClass || '']);
    const groupedDetailListClassName = mergeClassNames([
        classes.listStyles,
        classes.groupedListStyles,
        props.detailsListClass || ''
    ]);
    const getColumns = (columns) => {
        let filteredColumns = props.hideColumnPicker
            ? columns
            : columns && columns.filter((column) => column.selected === true);
        return filteredColumns;
    };
    const onRenderCheckbox = (checkboxProps) => (_jsx("div", Object.assign({ className: classes.checkBoxEvent }, { children: _jsx(Checkbox, { checked: checkboxProps.checked }, void 0) }), void 0));
    const groupProps = props.groupProps || {};
    groupProps.headerProps = groupProps.headerProps || {};
    groupProps.headerProps.onRenderGroupHeaderCheckbox =
        groupProps.headerProps.onRenderGroupHeaderCheckbox || onRenderCheckbox;
    return (_jsx(DetailsList, Object.assign({}, props, { onRenderCheckbox: onRenderCheckbox, groupProps: groupProps, columns: getColumns(props.columns), className: props.groups ? groupedDetailListClassName : detailListClassName, selectionMode: props.allowSelection
            ? props.selectionMode
                ? props.selectionMode
                : SelectionMode.multiple
            : SelectionMode.none, selectionPreservedOnEmptyClick: props.selectionPreservedOnEmptyClick || true, layoutMode: DetailsListLayoutMode.justified, isHeaderVisible: props.isHeaderVisible ? props.isHeaderVisible : true }), void 0));
};
