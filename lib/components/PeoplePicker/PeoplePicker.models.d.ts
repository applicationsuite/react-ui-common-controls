/// <reference types="react" />
import { IPersonaProps, IPickerItemProps, IBasePickerProps, ISuggestionItemProps } from '@fluentui/react';
export declare enum PeoplePickerType {
    InMemory = 0,
    ServerSide = 1
}
export interface IPeoplePickerProps extends IBasePickerProps<IPersonaProps> {
    type: PeoplePickerType;
    disabled?: boolean;
    itemLimit?: number;
    items: IPersonaProps[];
    suggestionsLimit?: number;
    showSuggestionsOnFocus?: boolean;
    isRemoveSuggestionAllowed?: boolean;
    componentRef?: any;
    label?: string;
    required?: boolean;
    errorMessage?: string;
    ariaLabel?: string;
    placeHolderText?: string;
    suggestionHeaderText?: string;
    onChange?: (items?: IPersonaProps[]) => void;
    onResolveSuggestions: (filterText: string, selectedItems?: IPersonaProps[]) => IPersonaProps[] | PromiseLike<IPersonaProps[]>;
    onRenderSuggestionsItem?: (item: IPersonaProps, itemProps: ISuggestionItemProps<IPersonaProps>) => JSX.Element;
    onRenderItem?: (props: IPickerItemProps<IPersonaProps>) => JSX.Element;
    className?: string;
    labelClassName?: string;
    errorTextClassName?: string;
    suggestionsCalloutClassName?: string;
}
