import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { filterLabelStyles } from './GridFilterLabel.styles';
const useStyles = createUseStyles(filterLabelStyles);
export const GridFilterLabel = ({ filterName, children, isFilterCollapsible }) => {
    const classes = useStyles();
    return (_jsxs("div", Object.assign({ className: "grid-filter-label" }, { children: [_jsx("div", Object.assign({ className: classes.filterLabel }, { children: filterName }), void 0), children] }), void 0));
};
