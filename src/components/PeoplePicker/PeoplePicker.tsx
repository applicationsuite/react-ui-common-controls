import React from 'react';
import { IPeoplePickerProps, PeoplePickerType } from './PeoplePicker.models';
import {
  NormalPeoplePicker,
  IBasePickerSuggestionsProps,
  Label,
  IInputProps,
  ICalloutProps,
  IPersonaProps
} from '@fluentui/react';
import { createUseStyles } from 'react-jss';
import { useLocalization, localizedString } from '../LanguageProvider';
import { mergeClassNames } from '../../utilities/mergeClassNames';
import { COMMON_LOCALIZATION_STRINGS } from '../../constants/CommonConstants';
import { peoplePickerStyles } from './PeoplePicker.styles';

const useStyles = createUseStyles(peoplePickerStyles);

export const PeoplePicker: React.FC<IPeoplePickerProps> = (props) => {
  const [filteredItems, setFilteredItems] = React.useState<IPersonaProps[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>();
  const [suggestionLimit, setSuggestionLimit] = React.useState(props.suggestionsLimit);
  const classes = useStyles();
  const localization = useLocalization();

  React.useEffect(() => {
    setFilteredItems(props.items || []);
  }, [props.items]);

  React.useEffect(() => {
    setSelectedItems(props.selectedItems || []);
  }, [props.selectedItems]);

  const isItemAlreadySelected = (item: IPersonaProps, selectedItems?: IPersonaProps[]) => {
    if (!selectedItems || !selectedItems.length || selectedItems.length === 0) {
      return false;
    }
    return selectedItems.filter((compareTag) => compareTag.text === item.text).length > 0;
  };

  const getPickerSuggestionProps = (inputProps: IPeoplePickerProps) => {
    const suggestionProps: IBasePickerSuggestionsProps = {
      noResultsFoundText: localizedString(
        COMMON_LOCALIZATION_STRINGS.NO_RESULTS_FOUND,
        localization
      ),
      loadingText: localizedString(COMMON_LOCALIZATION_STRINGS.LOADING, localization),
      resultsMaximumNumber: suggestionLimit,
      mostRecentlyUsedHeaderText: localizedString(
        COMMON_LOCALIZATION_STRINGS.SUGGESTED_RESULTS,
        localization
      ),
      suggestionsContainerAriaLabel: localizedString(
        COMMON_LOCALIZATION_STRINGS.SUGGESTED_RESULTS,
        localization
      ),
      showRemoveButtons: inputProps.isRemoveSuggestionAllowed
    };
    if (props.type === PeoplePickerType.InMemory && suggestionLimit) {
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

  const getInputProps = (inputProps: IPeoplePickerProps) => {
    const inputPropsData: IInputProps = {};
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

  const getPickerCalloutProps = (inputProps: IPeoplePickerProps) => {
    const inputPropsData: ICalloutProps = {
      doNotLayer: true
    };
    return inputPropsData;
  };

  const getTextFromItem = (item: IPersonaProps, currentValue?: string) => {
    return item.text || '';
  };

  const onItemSelected = (item?: IPersonaProps) => {
    if (!item) {
      return null;
    }
    if (isItemAlreadySelected(item, selectedItems)) {
      return null;
    }
    return item;
  };

  const onChange = (items?: IPersonaProps[]) => {
    setSelectedItems(items || []);
    props.onChange && props.onChange(items || []);
  };

  const onResolveSuggestions = (filterText: string, selectedItems?: IPersonaProps[]) => {
    if (props.type === PeoplePickerType.InMemory) {
      props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
      const filteredItems = getFilteredItems(
        filterText,
        props.items,
        selectedItems,
        props.suggestionsLimit
      );
      return filteredItems;
    } else {
      return props.onResolveSuggestions
        ? props.onResolveSuggestions(filterText, selectedItems)
        : [];
    }
  };

  const onEmptyResolveSuggestions = (selectedItems: IPersonaProps[] = []) => {
    if (props.type === PeoplePickerType.InMemory) {
      props.suggestionsLimit && setSuggestionLimit(props.suggestionsLimit);
      const filteredItems = getFilteredItems(
        '',
        props.items,
        selectedItems,
        props.suggestionsLimit
      );
      return filteredItems;
    } else {
      if (props.onEmptyResolveSuggestions) {
        return props.onEmptyResolveSuggestions
          ? props.onEmptyResolveSuggestions(selectedItems)
          : [];
      }
      return props.onResolveSuggestions ? props.onResolveSuggestions('', selectedItems) : [];
    }
  };

  const onRemoveSuggestion = (selectedItem: IPersonaProps) => {
    if (props.onRemoveSuggestion) {
      props.onRemoveSuggestion(selectedItem);
      return;
    }
    const filteredSelectedItems = selectedItems?.filter((item) => item.text !== selectedItem.text);
    setSelectedItems(filteredSelectedItems || []);
    props.onChange && props.onChange(filteredSelectedItems || []);
  };

  const onGetMoreResults = (filter: string, selectedItems?: IPersonaProps[]) => {
    if (props.type === PeoplePickerType.InMemory) {
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
    } else {
      return props.onGetMoreResults ? props.onGetMoreResults(filter, selectedItems) : [];
    }
  };

  const getFilteredItems = (
    filterText: string,
    items: IPersonaProps[],
    selectedItems?: IPersonaProps[],
    suggestionLimit?: number
  ) => {
    let filteredItems = items || [];
    if (filterText) {
      filteredItems = filteredItems
        .filter(
          (item: IPersonaProps) => item.text!.toLowerCase().indexOf(filterText.toLowerCase()) > -1
        )
        .filter((item) => !isItemAlreadySelected(item, selectedItems));
    }
    if (selectedItems && selectedItems.length) {
      filteredItems = filteredItems.filter(
        (item) => !selectedItems.find((selected) => selected.text === item.text)
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
        <Label className={mergeClassNames([classes.peoplePickerLabel, props.labelClassName])}>
          {props.label}
          {props.required && (
            <span className="errorText" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}

      <NormalPeoplePicker
        {...props}
        inputProps={
          props.inputProps ? { ...getInputProps(props), ...props.inputProps } : getInputProps(props)
        }
        pickerCalloutProps={
          props.pickerCalloutProps
            ? { ...getPickerCalloutProps(props), ...props.pickerCalloutProps }
            : getPickerCalloutProps(props)
        }
        pickerSuggestionsProps={
          props.pickerSuggestionsProps
            ? { ...getPickerSuggestionProps(props), ...props.pickerSuggestionsProps }
            : getPickerSuggestionProps(props)
        }
        onResolveSuggestions={onResolveSuggestions}
        onEmptyResolveSuggestions={
          props.showSuggestionsOnFocus ? onEmptyResolveSuggestions : undefined
        }
        onRemoveSuggestion={onRemoveSuggestion}
        selectedItems={selectedItems}
        getTextFromItem={props.getTextFromItem ? props.getTextFromItem : getTextFromItem}
        onItemSelected={props.onItemSelected ? props.onItemSelected : onItemSelected}
        onChange={onChange}
        onGetMoreResults={onGetMoreResults}
        removeButtonAriaLabel={
          props.removeButtonAriaLabel
            ? props.removeButtonAriaLabel
            : localizedString(COMMON_LOCALIZATION_STRINGS.REMOVE, localization)
        }
        className={
          props.errorMessage
            ? mergeClassNames([classes.peoplePickerError, props.className])
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
