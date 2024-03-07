import { Fragment as _Fragment, jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { gridSummaryStyles } from './GridSummary.styles';
const useStyles = createUseStyles(gridSummaryStyles);
export const GridSummary = (props) => {
    const classes = useStyles();
    const { pageNumber, pageSize, totalCount, selectionCount = 0 } = props;
    const getPaginationSummary = (pageNumber, pageSize, totalCount) => {
        const startIndex = (pageNumber - 1) * pageSize + 1;
        const endIndex = Math.min(startIndex + pageSize - 1, totalCount);
        const summary = (_jsxs(_Fragment, { children: [!(pageNumber && pageSize) && totalCount ? `Showing ${totalCount} Records` : '', pageNumber && pageSize && totalCount
                    ? `Showing ${startIndex} to ${endIndex} of ${totalCount} Records`
                    : ''] }, void 0));
        return summary;
    };
    return (_jsxs("div", Object.assign({ className: classes.summary }, { children: [_jsx("span", Object.assign({ className: classes.summaryText }, { children: getPaginationSummary(pageNumber, pageSize, totalCount) }), void 0), selectionCount > 0 && (_jsx("span", Object.assign({ className: classes.summaryText }, { children: ` | ${selectionCount} item${selectionCount > 1 ? 's' : ''} selected` }), void 0))] }), void 0));
};
