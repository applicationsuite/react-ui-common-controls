export interface IAccordionProps {
    headerText?: string;
    isCollapsed?: boolean;
    hideToggleButton?: boolean;
    accordionHeaderClass?: string;
    accordionBodyClass?: string;
    headerTextClass?: string;
    toggleIconClass?: string;
    onRenderHeader?: () => any;
    onAccordionToggle?: (isCollapsed: boolean) => void;
}
export declare const ACCORDION_LOCALIZATION_STRINGS: {
    Accordion_ClickToExpand: {
        id: string;
        defaultMessage: string;
    };
    Accordion_ClickToCollapse: {
        id: string;
        defaultMessage: string;
    };
};
