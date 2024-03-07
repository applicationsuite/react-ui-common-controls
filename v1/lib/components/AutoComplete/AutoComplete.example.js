import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { AutoComplete, AutoCompleteType } from '.';
export const AutoCompleteExample = () => {
    const getItems = () => {
        let items = [];
        for (let i = 0; i < 100; i++) {
            items.push({
                key: i,
                name: i.toString()
            });
        }
        return items;
    };
    const [items, setItems] = React.useState(getItems());
    const onFilterTextChange = (filterText, selectedItems) => {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([{ key: 1, name: '1' }]);
            }, 2000);
        });
        return promise;
    };
    const onRenderSuggestionsItem = (item, itemProps) => {
        return _jsx("b", { children: item.name }, void 0);
    };
    const onRenderSelectedItem = (selection) => {
        console.log(selection);
        return _jsx("span", { children: selection.item.name }, selection.item.key);
    };
    const onSelectionChange = (items) => {
        console.log(items);
    };
    return (_jsx(_Fragment, { children: _jsx(AutoComplete, { type: AutoCompleteType.InMemory, items: items, label: "Numbers", selectionLimit: 5, allowCustomItem: true, onSelectionChange: onSelectionChange, showSuggestionsOnFocus: true, 
            // onFilterTextChange={onFilterTextChange}
            // onRenderSelectedItem={onRenderSelectedItem}
            // onRenderSuggestionsItem={onRenderSuggestionsItem}
            // errorMessage={'Invalid Selection'}
            placeHolderText: 'Select a number' }, void 0) }, void 0));
};
