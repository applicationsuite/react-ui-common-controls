import React from 'react';
import { PeoplePicker, PeoplePickerType } from '.';
import { IPersonaProps } from '@fluentui/react';

export const PeoplePickerExample = () => {
  const getItems = () => {
    let items: IPersonaProps[] = [];
    for (let i = 10; i < 100; i++) {
      items.push({
        text: i.toString()
      });
    }
    return items;
  };
  const [items, setItems] = React.useState(getItems());

  const onResolveSuggestions = (filterText: string, selectedItems?: IPersonaProps[]) => {
    let promise = new Promise<IPersonaProps[]>((resolve, reject) => {
      setTimeout(() => {
        resolve([{ text: '1' }]);
      }, 2000);
    });
    return promise;
  };

  const onSelectionChange = (items?: IPersonaProps[]) => {
    console.log(items);
  };

  return (
    <>
      <PeoplePicker
        type={PeoplePickerType.InMemory}
        items={items}
        label="People"
        itemLimit={5}
        onResolveSuggestions={onResolveSuggestions}
        onChange={onSelectionChange}
        showSuggestionsOnFocus={true}
        // errorMessage={'Invalid Selection'}
        placeHolderText={'Select a Person'}
      ></PeoplePicker>
    </>
  );
};
