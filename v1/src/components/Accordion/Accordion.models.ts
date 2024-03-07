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

export const ACCORDION_LOCALIZATION_STRINGS = {
  Accordion_ClickToExpand: { id: 'Accordion_ClickToExpand', defaultMessage: 'Click to expand' },
  Accordion_ClickToCollapse: {
    id: 'Accordion_ClickToCollapse',
    defaultMessage: 'Click to collpase'
  }
};
