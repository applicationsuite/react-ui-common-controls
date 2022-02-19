import React from 'react';
import { IAutoCompleteProps, IAutoCompleteItem, AutoCompleteType } from './AutoComplete.models';
import {
  TagPicker,
  ICalloutProps,
  ITag,
  IInputProps,
  IBasePickerSuggestionsProps,
  Label
} from '@fluentui/react';
import { createUseStyles } from 'react-jss';
import { mergeClassNames, useLocalization, getLocalizedString } from '../../';
import { autoCompleteStyles } from './AutoComplete.styles';

const useStyles = createUseStyles(autoCompleteStyles);

export const AutoComplete: React.FC<IAutoCompleteProps> = (props) => {
  const [filteredItems, setFilteredItems] = React.useState<IAutoCompleteItem[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<IAutoCompleteItem[]>();
  const [suggestionLimit, setSuggestionLimit] = React.useState(props.suggestionsLimit);
  const classes = useStyles();
  const localization = useLocalization();

  React.useEffect(() => {
    setFilteredItems(props.items || []);
  }, [props.items]);

  React.useEffect(() => {
    setSelectedItems(props.selectedItems || []);
  }, [props.selectedItems]);

  const isItemAlreadySelected = (item: ITag, selectedItems?: ITag[]) => {
    if (!selectedItems || !selectedItems.length || selectedItems.length === 0) {
      return false;
    }
    return selectedItems.filter((compareTag) => compareTag.name === item.name).length > 0;
  };

  const getPickerSuggestionProps = (inputProps: IAutoCompleteProps) => {
    const suggestionProps: IBasePickerSuggestionsProps = {
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
          })}  ${suggestionLimit} ${
            props.suggestionHeaderText
              ? props.suggestionHeaderText
              : getLocalizedString(localization, {
                  id: 'Core.AutoComplete.Results',
                  defaultMessage: 'results'
                })
          }`
        : `${
            props.suggestionHeaderText
              ? props.suggestionHeaderText
              : getLocalizedString(localization, {
                  id: 'Core.AutoComplete.AllResults',
                  defaultMessage: 'All results'
                })
          }`;
      suggestionProps.searchForMoreText = isShowMoreRequired
        ? getLocalizedString(localization, {
            id: 'Core.AutoComplete.ShowMore',
            defaultMessage: 'Show more'
          })
        : '';
    }
    return suggestionProps;
  };

  const getInputProps = (inputProps: IAutoCompleteProps) => {
    const inputPropsData: IInputProps = {};
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

  const getPickerCalloutProps = (inputProps: IAutoCompleteProps) => {
    const inputPropsData: ICalloutProps = {
      doNotLayer: true
    };
    return inputPropsData;
  };

  const getTextFromItem = (item: ITag) => {
    return item.name;
  };

  const onItemSelected = (item?: ITag) => {
    if (!item) {
      return null;
    }
    if (isItemAlreadySelected(item, selectedItems)) {
      return null;
    }
    return item;
  };

  const onSelectionChange = (items?: ITag[]) => {
    setSelectedItems(items || []);
    props.onSelectionChange && props.onSelectionChange(items || []);
  };

  const onResolveSuggestions = (filterText: string, selectedItems?: IAutoCompleteItem[]) => {
    if (props.type === AutoCompleteType.InMemory) {
      props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
      const filteredItems = getFilteredItems(
        filterText,
        props.items,
        selectedItems,
        props.suggestionsLimit,
        props.allowCustomItem
      );
      return filteredItems;
    } else {
      return props.onFilterTextChange ? props.onFilterTextChange(filterText, selectedItems) : [];
    }
  };

  const onEmptyResolveSuggestions = (selectedItems: IAutoCompleteItem[] = []) => {
    if (props.type === AutoCompleteType.InMemory) {
      props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
      const filteredItems = getFilteredItems(
        '',
        props.items,
        selectedItems,
        props.suggestionsLimit
      );
      return filteredItems;
    } else {
      return props.onFilterTextChange ? props.onFilterTextChange('', selectedItems) : [];
    }
  };

  const onGetMoreResults = (filter: string, selectedItems?: ITag[]) => {
    if (!suggestionLimit) {
      return [];
    }
    let currentSuggesttionLimit = suggestionLimit || 0;
    currentSuggesttionLimit = currentSuggesttionLimit + (props.suggestionsLimit || 0);
    setSuggestionLimit(currentSuggesttionLimit);
    const filteredItems = getFilteredItems(
      filter,
      props.items,
      selectedItems,
      currentSuggesttionLimit
    );
    return filteredItems;
  };

  const getFilteredItems = (
    filterText: string,
    items: IAutoCompleteItem[],
    selectedItems?: IAutoCompleteItem[],
    suggestionLimit?: number,
    allowCustomItem?: boolean
  ) => {
    let filteredItems = items || [];
    if (filterText) {
      filteredItems = filteredItems
        .filter((item: ITag) => item.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1)
        .filter((item) => !isItemAlreadySelected(item, selectedItems));
      if (allowCustomItem && filteredItems.length === 0) {
        filteredItems = [
          { key: new Date().getMilliseconds() + filterText.length, name: filterText }
        ];
      }
    }
    if (selectedItems && selectedItems.length) {
      filteredItems = filteredItems.filter(
        (item) => !selectedItems.find((selected) => selected.key === item.key)
      );
    }
    if (filteredItems.length !== items.length) {
      setFilteredItems(filteredItems);
    }
    if (suggestionLimit) {
      filteredItems = filteredItems.slice(0, suggestionLimit);
    }
    return filteredItems;
  };

  return (
    <>
      {props.label && (
        <Label className={mergeClassNames([classes.autoCompleteLabel, props.labelClassName])}>
          {props.label}
          {props.required && (
            <span className="errorText" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}

      <TagPicker
        inputProps={getInputProps(props)}
        pickerCalloutProps={getPickerCalloutProps(props)}
        pickerSuggestionsProps={getPickerSuggestionProps(props)}
        onResolveSuggestions={onResolveSuggestions}
        onEmptyResolveSuggestions={
          props.showSuggestionsOnFocus ? onEmptyResolveSuggestions : undefined
        }
        selectedItems={selectedItems}
        getTextFromItem={getTextFromItem}
        itemLimit={props.selectionLimit ? props.selectionLimit : 1}
        onItemSelected={onItemSelected}
        onChange={onSelectionChange}
        onGetMoreResults={onGetMoreResults}
        onRenderSuggestionsItem={props.onRenderSuggestionsItem}
        onRenderItem={props.onRenderSelectedItem}
        componentRef={props.componentRef}
        removeButtonAriaLabel={getLocalizedString(localization, {
          id: 'Core.AutoComplete.Remove',
          defaultMessage: 'Remove'
        })}
        disabled={props.disabled}
        className={
          props.errorMessage
            ? mergeClassNames([classes.autoCompleteError, props.className])
            : props.className
        }
      />

      {props.errorMessage && (
        <div role="alert" aria-live="assertive">
          <span className={mergeClassNames([classes.errorText, props.errorTextClassName])}>
            {props.errorMessage}
          </span>
        </div>
      )}
    </>
  );
};
