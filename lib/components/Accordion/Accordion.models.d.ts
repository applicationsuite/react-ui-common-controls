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
