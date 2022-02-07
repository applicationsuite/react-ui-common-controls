import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { IconButton, Dropdown, DefaultButton } from '@fluentui/react';
import { PageType } from './Pagination.models';
import { paginationStyles } from './Pagination.styles';
const useStyles = createUseStyles(paginationStyles);
const defaultProps = {
    initialPage: 1,
    pageSize: 10,
    options: [10, 20, 30, 50, 100]
};
export const getPaginationSummary = (pageNumber, pageSize, totalCount) => {
    const startIndex = (pageNumber - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, totalCount);
    const summary = (_jsxs("span", { children: [!(pageNumber && pageSize) && totalCount ? `Showing ${totalCount} Records` : '', pageNumber && pageSize && totalCount
                ? `Showing ${startIndex} to ${endIndex} of ${totalCount} Records`
                : ''] }, void 0));
    return summary;
};
export const Pagination = (props) => {
    let { pageSize, options, pageNumber, showSummary } = props;
    const { totalCount, onPaginationChange } = props;
    const classes = useStyles();
    pageNumber = pageNumber || defaultProps.initialPage;
    pageSize = pageSize || defaultProps.pageSize;
    options = options || defaultProps.options;
    showSummary = showSummary || false;
    const [currentPage, setCurrentPage] = React.useState(pageNumber);
    React.useEffect(() => {
        setCurrentPage(pageNumber);
    }, [pageNumber]);
    const totalPages = Math.ceil(totalCount / pageSize);
    const getPageRange = () => {
        let startPage = 1;
        let endPage;
        if (totalPages <= 5) {
            endPage = totalPages;
        }
        else if (pageNumber <= 3) {
            endPage = 5;
        }
        else if (pageNumber + 2 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        }
        else {
            startPage = pageNumber - 2;
            endPage = pageNumber + 2;
        }
        return [...Array(endPage + 1 - startPage).keys()].map((i) => startPage + i);
    };
    const onPageChange = (pageNo) => {
        onPaginationChange && onPaginationChange(pageNo, pageSize);
    };
    const onPageSizeChange = (pagesize) => {
        onPaginationChange && onPaginationChange(1, pagesize);
    };
    const dropdownOptions = options.map((value, index) => ({
        key: value,
        text: String(value),
        id: String(index)
    }));
    if (totalCount === 0) {
        return null;
    }
    return (_jsxs("div", Object.assign({ className: classes.pagination }, { children: [_jsxs("div", Object.assign({ className: classes.container }, { children: [_jsx(Dropdown, { className: classes.dropdown, options: dropdownOptions, defaultSelectedKey: pageSize, onChange: (e, selectedOption) => {
                            if (selectedOption) {
                                onPageSizeChange(+selectedOption.key);
                            }
                        } }, void 0), _jsx("div", Object.assign({ className: classes.summary }, { children: showSummary && getPaginationSummary(currentPage, pageSize, totalCount) }), void 0)] }), void 0), _jsxs("div", Object.assign({ className: classes.pages }, { children: [_jsx(IconButton, { iconProps: { iconName: 'ChevronLeft' }, disabled: currentPage === 1, "aria-label": currentPage === 1 ? 'Disabled Previous Page' : 'Previous Page', onClick: () => onPageChange(currentPage - 1) }, void 0), getPageRange().map((page, index) => (_jsx("div", { children: _jsx(DefaultButton, { className: currentPage === page ? classes.selectedPage : classes.page, text: String(page), "aria-label": `Page ${page}`, onClick: () => onPageChange(page) }, void 0) }, index))), _jsx(IconButton, { iconProps: { iconName: 'ChevronRight' }, disabled: currentPage === totalPages, "aria-label": currentPage === totalPages ? 'Disabled Next Page' : 'Next Page', onClick: () => onPageChange(currentPage + 1) }, void 0)] }), void 0)] }), void 0));
};
export const PaginationWithoutPages = (props) => {
    const classes = useStyles();
    const { isPreviousAllowed, isNextAllowed, onPageChange } = props;
    return (_jsxs("div", Object.assign({ className: classes.paginationRight }, { children: [_jsx(IconButton, { iconProps: { iconName: 'ChevronLeft' }, disabled: !isPreviousAllowed, "aria-label": !isPreviousAllowed ? 'Disabled Previous Page' : 'Previous Page', onClick: () => onPageChange(PageType.Previous) }, void 0), _jsx(IconButton, { iconProps: { iconName: 'ChevronRight' }, disabled: !isNextAllowed, "aria-label": !isNextAllowed ? 'Disabled Next Page' : 'Next Page', onClick: () => onPageChange(PageType.Next) }, void 0)] }), void 0));
};
