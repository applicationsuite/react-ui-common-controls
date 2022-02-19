import React from 'react';
import { AutoComplete, IAutoCompleteItem, AutoCompleteType, IAutoCompleteSelection } from '.';

export const AutoCompleteExample = () => {
  const getItems = () => {
    let items: IAutoCompleteItem[] = [];
    for (let i = 0; i < 100; i++) {
      items.push({
        key: i,
        name: i.toString()
      });
    }
    return items;
  };
  const [items, setItems] = React.useState(getItems());

  const onFilterTextChange = (filterText: string, selectedItems?: IAutoCompleteItem[]) => {
    let promise = new Promise<IAutoCompleteItem[]>((resolve, reject) => {
      setTimeout(() => {
        resolve([{ key: 1, name: '1' }]);
      }, 2000);
    });
    return promise;
  };

  const onRenderSuggestionsItem = (item: IAutoCompleteItem, itemProps: any) => {
    return <b>{item.name}</b>;
  };

  const onRenderSelectedItem = (selection: IAutoCompleteSelection) => {
    console.log(selection);
    return <span key={selection.item.key}>{selection.item.name}</span>;
  };

  const onSelectionChange = (items: IAutoCompleteItem[]) => {
    console.log(items);
  };

  return (
    <>
      <AutoComplete
        type={AutoCompleteType.InMemory}
        items={items}
        label="Numbers"
        selectionLimit={5}
        allowCustomItem={true}
        onSelectionChange={onSelectionChange}
        showSuggestionsOnFocus={true}
        // onFilterTextChange={onFilterTextChange}
        // onRenderSelectedItem={onRenderSelectedItem}
        // onRenderSuggestionsItem={onRenderSuggestionsItem}
        // errorMessage={'Invalid Selection'}
        placeHolderText={'Select a number'}
      ></AutoComplete>
    </>
  );
};
