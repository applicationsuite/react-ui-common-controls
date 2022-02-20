import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { PeoplePickerType } from './PeoplePicker.models';
import { NormalPeoplePicker, Label } from '@fluentui/react';
import { createUseStyles } from 'react-jss';
import { mergeClassNames, useLocalization, getLocalizedString } from '../../';
import { peoplePickerStyles } from './PeoplePicker.styles';
const useStyles = createUseStyles(peoplePickerStyles);
export const PeoplePicker = (props) => {
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
        return selectedItems.filter((compareTag) => compareTag.text === item.text).length > 0;
    };
    const getPickerSuggestionProps = (inputProps) => {
        const suggestionProps = {
            noResultsFoundText: getLocalizedString(localization, {
                id: 'Core.Common.NoResultsFound',
                defaultMessage: 'No Results Found'
            }),
            loadingText: getLocalizedString(localization, {
                id: 'Core.Common.Loading',
                defaultMessage: 'Loading'
            }),
            resultsMaximumNumber: suggestionLimit,
            mostRecentlyUsedHeaderText: getLocalizedString(localization, {
                id: 'Core.Common.SuggestedResults',
                defaultMessage: 'Suggested results'
            }),
            suggestionsContainerAriaLabel: getLocalizedString(localization, {
                id: 'Core.Common.SuggestedResults',
                defaultMessage: 'Suggested results'
            }),
            showRemoveButtons: inputProps.isRemoveSuggestionAllowed
        };
        if (props.type === PeoplePickerType.InMemory && suggestionLimit) {
            const isShowMoreRequired = filteredItems.length > suggestionLimit;
            suggestionProps.suggestionsHeaderText = isShowMoreRequired
                ? `${getLocalizedString(localization, {
                    id: 'Core.Common.ShowingTop',
                    defaultMessage: 'Showing top'
                })}  ${suggestionLimit} ${props.suggestionHeaderText
                    ? props.suggestionHeaderText
                    : getLocalizedString(localization, {
                        id: 'Core.Common.Results',
                        defaultMessage: 'results'
                    })}`
                : `${props.suggestionHeaderText
                    ? props.suggestionHeaderText
                    : getLocalizedString(localization, {
                        id: 'Core.Common.AllResults',
                        defaultMessage: 'All results'
                    })}`;
            suggestionProps.searchForMoreText = isShowMoreRequired
                ? getLocalizedString(localization, {
                    id: 'Core.Common.ShowMore',
                    defaultMessage: 'Show More'
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
                ? mergeClassNames([classes.peoplePickerError, props.className])
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
    const getTextFromItem = (item, currentValue) => {
        return item.text || '';
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
    const onChange = (items) => {
        setSelectedItems(items || []);
        props.onChange && props.onChange(items || []);
    };
    const onResolveSuggestions = (filterText, selectedItems) => {
        if (props.type === PeoplePickerType.InMemory) {
            props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
            const filteredItems = getFilteredItems(filterText, props.items, selectedItems, props.suggestionsLimit);
            return filteredItems;
        }
        else {
            return props.onResolveSuggestions
                ? props.onResolveSuggestions(filterText, selectedItems)
                : [];
        }
    };
    const onEmptyResolveSuggestions = (selectedItems = []) => {
        if (props.type === PeoplePickerType.InMemory) {
            props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
            const filteredItems = getFilteredItems('', props.items, selectedItems, props.suggestionsLimit);
            return filteredItems;
        }
        else {
            if (props.onEmptyResolveSuggestions) {
                return props.onEmptyResolveSuggestions
                    ? props.onEmptyResolveSuggestions(selectedItems)
                    : [];
            }
            return props.onResolveSuggestions ? props.onResolveSuggestions('', selectedItems) : [];
        }
    };
    const onRemoveSuggestion = (selectedItem) => {
        if (props.onRemoveSuggestion) {
            props.onRemoveSuggestion(selectedItem);
            return;
        }
        const filteredSelectedItems = selectedItems === null || selectedItems === void 0 ? void 0 : selectedItems.filter((item) => item.text !== selectedItem.text);
        setSelectedItems(filteredSelectedItems || []);
        props.onChange && props.onChange(filteredSelectedItems || []);
    };
    const onGetMoreResults = (filter, selectedItems) => {
        if (props.type === PeoplePickerType.InMemory) {
            if (!suggestionLimit) {
                return [];
            }
            let currentSuggesttionLimit = suggestionLimit || 0;
            currentSuggesttionLimit = currentSuggesttionLimit + (props.suggestionsLimit || 0);
            setSuggestionLimit(currentSuggesttionLimit);
            const filteredItems = getFilteredItems(filter, props.items, selectedItems, currentSuggesttionLimit);
            return filteredItems;
        }
        else {
            return props.onGetMoreResults ? props.onGetMoreResults(filter, selectedItems) : [];
        }
    };
    const getFilteredItems = (filterText, items, selectedItems, suggestionLimit) => {
        let filteredItems = items || [];
        if (filterText) {
            filteredItems = filteredItems
                .filter((item) => item.text.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
                .filter((item) => !isItemAlreadySelected(item, selectedItems));
        }
        if (selectedItems && selectedItems.length) {
            filteredItems = filteredItems.filter((item) => !selectedItems.find((selected) => selected.text === item.text));
        }
        if (filteredItems.length !== items.length) {
            setFilteredItems(filteredItems);
        }
        if (suggestionLimit) {
            filteredItems = filteredItems.slice(0, suggestionLimit);
        }
        return filteredItems;
    };
    return (_jsxs(_Fragment, { children: [props.label && (_jsxs(Label, Object.assign({ className: mergeClassNames([classes.peoplePickerLabel, props.labelClassName]) }, { children: [props.label, props.required && (_jsx("span", Object.assign({ className: "errorText", "aria-label": "required" }, { children: "*" }), void 0))] }), void 0)), _jsx(NormalPeoplePicker, Object.assign({}, props, { inputProps: props.inputProps ? Object.assign(Object.assign({}, getInputProps(props)), props.inputProps) : getInputProps(props), pickerCalloutProps: props.pickerCalloutProps
                    ? Object.assign(Object.assign({}, getPickerCalloutProps(props)), props.pickerCalloutProps) : getPickerCalloutProps(props), pickerSuggestionsProps: props.pickerSuggestionsProps
                    ? Object.assign(Object.assign({}, getPickerSuggestionProps(props)), props.pickerSuggestionsProps) : getPickerSuggestionProps(props), onResolveSuggestions: onResolveSuggestions, onEmptyResolveSuggestions: props.showSuggestionsOnFocus ? onEmptyResolveSuggestions : undefined, onRemoveSuggestion: onRemoveSuggestion, selectedItems: selectedItems, getTextFromItem: props.getTextFromItem ? props.getTextFromItem : getTextFromItem, onItemSelected: props.onItemSelected ? props.onItemSelected : onItemSelected, onChange: onChange, onGetMoreResults: onGetMoreResults, removeButtonAriaLabel: props.removeButtonAriaLabel
                    ? props.removeButtonAriaLabel
                    : getLocalizedString(localization, {
                        id: 'Core.Common.Remove',
                        defaultMessage: 'Remove'
                    }), className: props.errorMessage
                    ? mergeClassNames([classes.peoplePickerError, props.className])
                    : props.className }), void 0), props.errorMessage && (_jsx("div", Object.assign({ role: "alert", "aria-live": "assertive" }, { children: _jsx("span", Object.assign({ className: mergeClassNames([classes.errorText, props.errorTextClassName]) }, { children: props.errorMessage }), void 0) }), void 0))] }, void 0));
};
