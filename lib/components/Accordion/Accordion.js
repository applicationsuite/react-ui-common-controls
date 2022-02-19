import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { accordionStyles } from './Accordion.styles';
import { mergeClassNames, useLocalization, getLocalizedString } from '../../';
const useStyles = createUseStyles(accordionStyles);
export const Accordion = (props) => {
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
    return (_jsxs(_Fragment, { children: [_jsxs("div", Object.assign({ className: mergeClassNames([classes.accordionHeader, props.accordionHeaderClass]), "aria-label": isCollapsed
                    ? getLocalizedString(localization, {
                        id: 'Core.Accordion.ClickToExpand',
                        defaultMessage: 'Click to expand'
                    })
                    : getLocalizedString(localization, {
                        id: 'Core.Accordion.ClickToCollapse',
                        defaultMessage: 'Click to collpase'
                    }), "aria-expanded": !isCollapsed, onClick: onToggleAccordion }, { children: [!props.hideToggleButton && (_jsx("div", { className: isCollapsed
                            ? mergeClassNames([classes.collapseIcon, props.toggleIconClass])
                            : mergeClassNames([
                                classes.collapseIcon,
                                classes.collapseIconRotate,
                                props.toggleIconClass
                            ]), "aria-expanded": !isCollapsed }, void 0)), props.onRenderHeader ? (props.onRenderHeader()) : (_jsx("div", Object.assign({ className: mergeClassNames([classes.headerText, props.headerTextClass]) }, { children: props.headerText }), void 0))] }), void 0), !isCollapsed && (_jsx("div", Object.assign({ className: mergeClassNames([classes.accordionBody, props.accordionBodyClass]) }, { children: props.children }), void 0))] }, void 0));
};
