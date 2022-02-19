import { ITag, IPickerItemProps } from '@fluentui/react';
export declare enum AutoCompleteType {
    InMemory = 0,
    ServerSide = 1
}
export interface IAutoCompleteProps {
    type: AutoCompleteType;
    items: IAutoCompleteItem[];
    selectedItems?: IAutoCompleteItem[];
    allowCustomItem?: boolean;
    selectionLimit?: number;
    suggestionsLimit?: number;
    showSuggestionsOnFocus?: boolean;
    onSelectionChange?: (items: any[]) => void;
    onFilterTextChange?: (filterText: string, selectedItems?: IAutoCompleteItem[]) => IAutoCompleteItem[] | Promise<IAutoCompleteItem[]>;
    onRenderSuggestionsItem?: (item: IAutoCompleteItem, itemProps: any) => any;
    onRenderSelectedItem?: (selection: IAutoCompleteSelection) => any;
    disabled?: boolean;
    componentRef?: any;
    label?: string;
    required?: boolean;
    errorMessage?: string;
    ariaLabel?: string;
    placeHolderText?: string;
    suggestionHeaderText?: string;
    className?: string;
    labelClassName?: string;
    errorTextClassName?: string;
    suggestionsCalloutcCassName?: string;
}
export interface IAutoCompleteItem extends ITag {
    data?: any;
}
export interface IAutoCompleteSelection extends IPickerItemProps<IAutoCompleteItem> {
}
