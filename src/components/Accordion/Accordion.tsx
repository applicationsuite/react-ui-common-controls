import React from 'react';
import { IAccordionProps } from './Accordion.models';
import { createUseStyles } from 'react-jss';
import { accordionStyles } from './Accordion.styles';
import { mergeClassNames, useLocalization, getLocalizedString } from '../../';

const useStyles = createUseStyles(accordionStyles);

export const Accordion: React.FC<IAccordionProps> = (props) => {
  const classes = useStyles();
  const [isCollapsed, setCollpased] = React.useState(false);
  const localization = useLocalization();

  React.useEffect(() => {
    setCollpased(props.isCollapsed || false);
  }, [props.isCollapsed]);

  const onToggleAccordion = () => {
    let isCollpasedOld = isCollapsed;
    setCollpased(!isCollpasedOld);
    props.onAccordionToggle && props.onAccordionToggle(!isCollpasedOld);
  };

  return (
    <>
      <div
        className={mergeClassNames([classes.accordionHeader, props.accordionHeaderClass])}
        aria-label={
          isCollapsed
            ? getLocalizedString(localization, {
                id: 'Core.Accordion.ClickToExpand',
                defaultMessage: 'Click to expand'
              })
            : getLocalizedString(localization, {
                id: 'Core.Accordion.ClickToCollapse',
                defaultMessage: 'Click to collpase'
              })
        }
        aria-expanded={!isCollapsed}
        onClick={onToggleAccordion}
      >
        {!props.hideToggleButton && (
          <div
            className={
              isCollapsed
                ? mergeClassNames([classes.collapseIcon, props.toggleIconClass])
                : mergeClassNames([
                    classes.collapseIcon,
                    classes.collapseIconRotate,
                    props.toggleIconClass
                  ])
            }
            aria-expanded={!isCollapsed}
          ></div>
        )}
        {props.onRenderHeader ? (
          props.onRenderHeader()
        ) : (
          <div className={mergeClassNames([classes.headerText, props.headerTextClass])}>
            {props.headerText}
          </div>
        )}
      </div>
      {!isCollapsed && (
        <div className={mergeClassNames([classes.accordionBody, props.accordionBodyClass])}>
          {props.children}
        </div>
      )}
    </>
  );
};
