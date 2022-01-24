import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { SearchBox, IconButton } from '@fluentui/react';
import { quickSearchStyles } from './QuickSearch.styles';
const useStyles = createUseStyles(quickSearchStyles);
export const QuickSearch = ({ value, placeHolderText, onSearchTextChange, quickSearchOnEnter, hideSearchButton }) => {
    const classes = useStyles();
    const searchButtonRef = React.createRef();
    const onChange = (e) => {
        onSearchTextChange && onSearchTextChange(e === null || e === void 0 ? void 0 : e.target.value);
    };
    const onSearch = (searchValue) => {
        if (searchValue === value) {
            return;
        }
        onSearchTextChange && onSearchTextChange(searchValue);
    };
    const onSearchButtonClick = () => {
        if (searchButtonRef.current && searchButtonRef.current.state.value === value) {
            return;
        }
        onSearchTextChange && onSearchTextChange(searchButtonRef.current.state.value);
    };
    const onClear = () => {
        onSearchTextChange('');
    };
    return (_jsxs("div", Object.assign({ className: hideSearchButton ? classes.quickSearchWithoutButton : classes.quickSearch }, { children: [_jsx(SearchBox, { componentRef: searchButtonRef, value: value || '', className: classes.quickSearchBox, placeholder: placeHolderText || 'Search', onChange: quickSearchOnEnter ? undefined : onChange, onSearch: quickSearchOnEnter ? onSearch : undefined, onClear: onClear }, void 0), !hideSearchButton && (_jsx(IconButton, { iconProps: { iconName: 'Search' }, className: classes.quickSearchButton, ariaLabel: "Search", onClick: onSearchButtonClick }, void 0))] }), void 0));
};
