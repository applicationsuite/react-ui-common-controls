import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { Panel, PanelType, PrimaryButton, DefaultButton } from '@fluentui/react';
import { GridFilters } from './GridFilters';
import { gridFilterPanelStyles } from './GridFilterPanel.styles';
const useStyles = createUseStyles(gridFilterPanelStyles);
export const GridFilterPanel = (props) => {
    const classes = useStyles();
    const onRenderFooterContent = () => (_jsxs("div", Object.assign({ className: classes.filterFooterBtns }, { children: [props.onApplyFilters && (_jsx(PrimaryButton, Object.assign({ onClick: props.onApplyFilters, className: classes.applyBtn }, { children: "Apply" }), void 0)), _jsx(DefaultButton, Object.assign({ onClick: () => props.toggleFilters(false) }, { children: "Close" }), void 0)] }), void 0));
    const panelType = PanelType.smallFixedFar;
    return (_jsx(_Fragment, { children: _jsx(Panel, Object.assign({ isOpen: props.showFilters, onDismiss: () => props.toggleFilters(false), type: panelType, headerText: "Filters", closeButtonAriaLabel: "Close", onRenderFooter: onRenderFooterContent, isFooterAtBottom: true, className: classes.filterPanel }, { children: _jsx(GridFilters, { filters: props.filters, onFilterChange: props.onFilterChange }, void 0) }), void 0) }, void 0));
};
