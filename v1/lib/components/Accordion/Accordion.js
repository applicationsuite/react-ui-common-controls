import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { ACCORDION_LOCALIZATION_STRINGS } from './Accordion.models';
import { createUseStyles } from 'react-jss';
import { accordionStyles } from './Accordion.styles';
import { useLocalization, localizedString } from '../LanguageProvider';
import { mergeClassNames } from '../../utilities/mergeClassNames';
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
                    ? localizedString(ACCORDION_LOCALIZATION_STRINGS.Accordion_ClickToExpand, localization)
                    : localizedString(ACCORDION_LOCALIZATION_STRINGS.Accordion_ClickToCollapse, localization), "aria-expanded": !isCollapsed, onClick: onToggleAccordion }, { children: [!props.hideToggleButton && (_jsx("div", { className: isCollapsed
                            ? mergeClassNames([classes.collapseIcon, props.toggleIconClass])
                            : mergeClassNames([
                                classes.collapseIcon,
                                classes.collapseIconRotate,
                                props.toggleIconClass
                            ]), "aria-expanded": !isCollapsed }, void 0)), props.onRenderHeader ? (props.onRenderHeader()) : (_jsx("div", Object.assign({ className: mergeClassNames([classes.headerText, props.headerTextClass]) }, { children: props.headerText }), void 0))] }), void 0), !isCollapsed && (_jsx("div", Object.assign({ className: mergeClassNames([classes.accordionBody, props.accordionBodyClass]) }, { children: props.children }), void 0))] }, void 0));
};
