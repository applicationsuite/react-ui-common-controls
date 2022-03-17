import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { filterLabelStyles } from './GridFilterLabel.styles';
import { Accordion } from '../../Accordion';
const useStyles = createUseStyles(filterLabelStyles);
export const GridFilterLabel = ({ filterName, children, isFilterCollapsible }) => {
    const classes = useStyles();
    return (_jsx("div", Object.assign({ className: "grid-filter-label" }, { children: isFilterCollapsible ? (_jsx(Accordion, Object.assign({ headerText: filterName }, { children: children }), void 0)) : (_jsxs(_Fragment, { children: [_jsx("div", Object.assign({ className: classes.filterLabel }, { children: filterName }), void 0), children] }, void 0)) }), void 0));
};
