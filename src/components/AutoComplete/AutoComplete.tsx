import React from 'react';
import { IAutoCompleteProps, IAutoCompleteItem, AutoCompleteType } from './AutoComplete.models';
import { TagPicker, IInputProps, IBasePickerSuggestionsProps } from '@fluentui/react/lib/Pickers';
import { ICalloutProps } from '@fluentui/react/lib/Callout';
import { Label } from '@fluentui/react/lib/Label';
import { Icon } from '@fluentui/react/lib/Icon';
import { Stack } from '@fluentui/react/lib/Stack';

import { createUseStyles } from 'react-jss';
import { useLocalization, localizedString } from '../LanguageProvider';
import { mergeClassNames } from '../../utilities/mergeClassNames';
import { COMMON_LOCALIZATION_STRINGS } from '../../constants/CommonConstants';
import { autoCompleteStyles } from './AutoComplete.styles';

const useStyles = createUseStyles(autoCompleteStyles);

export const AutoComplete: React.FC<IAutoCompleteProps> = (props) => {
  const [filteredItems, setFilteredItems] = React.useState<IAutoCompleteItem[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<IAutoCompleteItem[]>();
  const [suggestionLimit, setSuggestionLimit] = React.useState(props.suggestionsLimit);
  const [searchText, setSearchText] = React.useState('');
  const classes = useStyles();
  const localization = useLocalization();

  React.useEffect(() => {
    setFilteredItems(props.items || []);
  }, [props.items]);

  React.useEffect(() => {
    setSelectedItems(props.selectedItems || []);
  }, [props.selectedItems]);

  const isItemAlreadySelected = (item: IAutoCompleteItem, selectedItems?: IAutoCompleteItem[]) => {
    if (!selectedItems || !selectedItems.length || selectedItems.length === 0) {
      return false;
    }
    return selectedItems.filter((compareTag) => compareTag.name === item.name).length > 0;
  };

  const getPickerSuggestionProps = (inputProps: IAutoCompleteProps) => {
    const suggestionProps: IBasePickerSuggestionsProps = {
      noResultsFoundText: props.allowCustomItem
        ? ''
        : localizedString(COMMON_LOCALIZATION_STRINGS.NO_RESULTS_FOUND, localization),
      loadingText: localizedString(COMMON_LOCALIZATION_STRINGS.LOADING, localization),
      resultsMaximumNumber: suggestionLimit
    };
    if (props.type === AutoCompleteType.InMemory && suggestionLimit) {
      const isShowMoreRequired = filteredItems.length > suggestionLimit;
      suggestionProps.suggestionsHeaderText = isShowMoreRequired
        ? `${localizedString(
            COMMON_LOCALIZATION_STRINGS.SHOWING_TOP,
            localization
          )}  ${suggestionLimit} ${
            props.suggestionHeaderText
              ? props.suggestionHeaderText
              : localizedString(COMMON_LOCALIZATION_STRINGS.RESULTS, localization)
          }`
        : `${
            props.suggestionHeaderText
              ? props.suggestionHeaderText
              : localizedString(COMMON_LOCALIZATION_STRINGS.ALL_RESULTS, localization)
          }`;
      suggestionProps.searchForMoreText = isShowMoreRequired
        ? localizedString(COMMON_LOCALIZATION_STRINGS.SHOW_MORE, localization)
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

  const getTextFromItem = (item: IAutoCompleteItem) => {
    return item.name;
  };

  const onItemSelected = (item?: IAutoCompleteItem) => {
    if (!item) {
      return null;
    }
    if (isItemAlreadySelected(item, selectedItems)) {
      return null;
    }
    return item;
  };

  const onSelectionChange = (items?: IAutoCompleteItem[]) => {
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

  const onGetMoreResults = (filter: string, selectedItems?: IAutoCompleteItem[]) => {
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
        .filter(
          (item: IAutoCompleteItem) =>
            item.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1
        )
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

  const onInputChange = (searchText: string) => {
    setSearchText(searchText);
    return searchText;
  };

  const onSearch = () => {
    props.loadSuggestionsOnSearch && props.loadSuggestionsOnSearch(searchText);
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
      <Stack horizontal>
        <TagPicker
          inputProps={getInputProps(props)}
          pickerCalloutProps={getPickerCalloutProps(props)}
          pickerSuggestionsProps={getPickerSuggestionProps(props)}
          onResolveSuggestions={onResolveSuggestions}
          onEmptyResolveSuggestions={
            props.showSuggestionsOnFocus && !props.loadSuggestionsOnSearch
              ? onEmptyResolveSuggestions
              : undefined
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
          removeButtonAriaLabel={localizedString(COMMON_LOCALIZATION_STRINGS.REMOVE, localization)}
          disabled={props.disabled}
          className={
            props.errorMessage
              ? mergeClassNames([classes.autoCompleteError, props.className])
              : mergeClassNames([classes.defaultAutoComplete, props.className])
          }
          onInputChange={onInputChange}
        />
        {props.loadSuggestionsOnSearch && (
          <Icon iconName="Search" className={classes.searchIcon} onClick={onSearch} tabIndex={0} />
        )}
      </Stack>

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
