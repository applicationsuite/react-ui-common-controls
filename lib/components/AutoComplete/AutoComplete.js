import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { AutoCompleteType } from './AutoComplete.models';
import { TagPicker, Label } from '@fluentui/react';
import { createUseStyles } from 'react-jss';
import { mergeClassNames, useLocalization, getLocalizedString } from '../../';
import { autoCompleteStyles } from './AutoComplete.styles';
const useStyles = createUseStyles(autoCompleteStyles);
export const AutoComplete = (props) => {
    const [filteredItems, setFilteredItems] = React.useState([]);
    const [selectedItems, setSelectedItems] = React.useState();
    const [suggestionLimit, setSuggestionLimit] = React.useState(props.suggestionsLimit);
    const classes = useStyles();
    const localization = useLocalization();
    React.useEffect(() => {
        setFilteredItems(props.items || []);
    }, [props.items]);
    React.useEffect(() => {
        setSelectedItems(props.selectedItems || []);
    }, [props.selectedItems]);
    const isItemAlreadySelected = (item, selectedItems) => {
        if (!selectedItems || !selectedItems.length || selectedItems.length === 0) {
            return false;
        }
        return selectedItems.filter((compareTag) => compareTag.name === item.name).length > 0;
    };
    const getPickerSuggestionProps = (inputProps) => {
        const suggestionProps = {
            noResultsFoundText: props.allowCustomItem
                ? ''
                : getLocalizedString(localization, {
                    id: 'Core.AutoComplete.NoResultsFound',
                    defaultMessage: 'No Results Found'
                }),
            loadingText: getLocalizedString(localization, {
                id: 'Core.AutoComplete.Loading',
                defaultMessage: 'Loading'
            }),
            resultsMaximumNumber: suggestionLimit
        };
        if (props.type === AutoCompleteType.InMemory && suggestionLimit) {
            const isShowMoreRequired = filteredItems.length > suggestionLimit;
            suggestionProps.suggestionsHeaderText = isShowMoreRequired
                ? `${getLocalizedString(localization, {
                    id: 'Core.AutoComplete.ShowingTop',
                    defaultMessage: 'Showing top'
                })}  ${suggestionLimit} ${props.suggestionHeaderText
                    ? props.suggestionHeaderText
                    : getLocalizedString(localization, {
                        id: 'Core.AutoComplete.Results',
                        defaultMessage: 'results'
                    })}`
                : `${props.suggestionHeaderText
                    ? props.suggestionHeaderText
                    : getLocalizedString(localization, {
                        id: 'Core.AutoComplete.AllResults',
                        defaultMessage: 'All results'
                    })}`;
            suggestionProps.searchForMoreText = isShowMoreRequired
                ? getLocalizedString(localization, {
                    id: 'Core.AutoComplete.ShowMore',
                    defaultMessage: 'Show more'
                })
                : '';
        }
        return suggestionProps;
    };
    const getInputProps = (inputProps) => {
        const inputPropsData = {};
        if (props.ariaLabel) {
            inputPropsData['aria-label'] = props.ariaLabel;
        }
        if (props.placeHolderText) {
            inputPropsData['placeholder'] = props.placeHolderText;
        }
        if (props.className) {
            const className = props.errorMessage
                ? mergeClassNames([classes.autoCompleteError, props.className])
                : props.className;
            inputPropsData['className'] = className;
        }
        return inputPropsData;
    };
    const getPickerCalloutProps = (inputProps) => {
        const inputPropsData = {
            doNotLayer: true
        };
        return inputPropsData;
    };
    const getTextFromItem = (item) => {
        return item.name;
    };
    const onItemSelected = (item) => {
        if (!item) {
            return null;
        }
        if (isItemAlreadySelected(item, selectedItems)) {
            return null;
        }
        return item;
    };
    const onSelectionChange = (items) => {
        setSelectedItems(items || []);
        props.onSelectionChange && props.onSelectionChange(items || []);
    };
    const onResolveSuggestions = (filterText, selectedItems) => {
        if (props.type === AutoCompleteType.InMemory) {
            props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
            const filteredItems = getFilteredItems(filterText, props.items, selectedItems, props.suggestionsLimit, props.allowCustomItem);
            return filteredItems;
        }
        else {
            return props.onFilterTextChange ? props.onFilterTextChange(filterText, selectedItems) : [];
        }
    };
    const onEmptyResolveSuggestions = (selectedItems = []) => {
        if (props.type === AutoCompleteType.InMemory) {
            props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
            const filteredItems = getFilteredItems('', props.items, selectedItems, props.suggestionsLimit);
            return filteredItems;
        }
        else {
            return props.onFilterTextChange ? props.onFilterTextChange('', selectedItems) : [];
        }
    };
    const onGetMoreResults = (filter, selectedItems) => {
        if (!suggestionLimit) {
            return [];
        }
        let currentSuggesttionLimit = suggestionLimit || 0;
        currentSuggesttionLimit = currentSuggesttionLimit + (props.suggestionsLimit || 0);
        setSuggestionLimit(currentSuggesttionLimit);
        const filteredItems = getFilteredItems(filter, props.items, selectedItems, currentSuggesttionLimit);
        return filteredItems;
    };
    const getFilteredItems = (filterText, items, selectedItems, suggestionLimit, allowCustomItem) => {
        let filteredItems = items || [];
        if (filterText) {
            filteredItems = filteredItems
                .filter((item) => item.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
                .filter((item) => !isItemAlreadySelected(item, selectedItems));
            if (allowCustomItem && filteredItems.length === 0) {
                filteredItems = [
                    { key: new Date().getMilliseconds() + filterText.length, name: filterText }
                ];
            }
        }
        if (selectedItems && selectedItems.length) {
            filteredItems = filteredItems.filter((item) => !selectedItems.find((selected) => selected.key === item.key));
        }
        if (filteredItems.length !== items.length) {
            setFilteredItems(filteredItems);
        }
        if (suggestionLimit) {
            filteredItems = filteredItems.slice(0, suggestionLimit);
        }
        return filteredItems;
    };
    return (_jsxs(_Fragment, { children: [props.label && (_jsxs(Label, Object.assign({ className: mergeClassNames([classes.autoCompleteLabel, props.labelClassName]) }, { children: [props.label, props.required && (_jsx("span", Object.assign({ className: "errorText", "aria-label": "required" }, { children: "*" }), void 0))] }), void 0)), _jsx(TagPicker, { inputProps: getInputProps(props), pickerCalloutProps: getPickerCalloutProps(props), pickerSuggestionsProps: getPickerSuggestionProps(props), onResolveSuggestions: onResolveSuggestions, onEmptyResolveSuggestions: props.showSuggestionsOnFocus ? onEmptyResolveSuggestions : undefined, selectedItems: selectedItems, getTextFromItem: getTextFromItem, itemLimit: props.selectionLimit ? props.selectionLimit : 1, onItemSelected: onItemSelected, onChange: onSelectionChange, onGetMoreResults: onGetMoreResults, onRenderSuggestionsItem: props.onRenderSuggestionsItem, onRenderItem: props.onRenderSelectedItem, componentRef: props.componentRef, removeButtonAriaLabel: getLocalizedString(localization, {
                    id: 'Core.AutoComplete.Remove',
                    defaultMessage: 'Remove'
                }), disabled: props.disabled, className: props.errorMessage
                    ? mergeClassNames([classes.autoCompleteError, props.className])
                    : props.className }, void 0), props.errorMessage && (_jsx("div", Object.assign({ role: "alert", "aria-live": "assertive" }, { children: _jsx("span", Object.assign({ className: mergeClassNames([classes.errorText, props.errorTextClassName]) }, { children: props.errorMessage }), void 0) }), void 0))] }, void 0));
};
