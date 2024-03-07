import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { PeoplePicker, PeoplePickerType } from '.';
export const PeoplePickerExample = () => {
    const getItems = () => {
        let items = [];
        for (let i = 10; i < 100; i++) {
            items.push({
                text: i.toString()
            });
        }
        return items;
    };
    const [items, setItems] = React.useState(getItems());
    const onResolveSuggestions = (filterText, selectedItems) => {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([{ text: '1' }]);
            }, 2000);
        });
        return promise;
    };
    const onSelectionChange = (items) => {
        console.log(items);
    };
    return (_jsx(_Fragment, { children: _jsx(PeoplePicker, { type: PeoplePickerType.InMemory, items: items, label: "People", itemLimit: 5, onResolveSuggestions: onResolveSuggestions, onChange: onSelectionChange, showSuggestionsOnFocus: true, 
            // errorMessage={'Invalid Selection'}
            placeHolderText: 'Select a Person' }, void 0) }, void 0));
};
