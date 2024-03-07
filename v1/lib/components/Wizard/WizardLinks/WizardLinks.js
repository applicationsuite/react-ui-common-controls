import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { WizardType, WizardStepStatus, WIZARD_STEP_STATUS_STRINGS } from '../Wizard.models';
import { wizardLinksStyles } from './WizardLinks.styles';
import { Accordion } from '../../Accordion';
import { mergeClassNames } from '../../../utilities/mergeClassNames';
const useStyles = createUseStyles(wizardLinksStyles);
export const WizardLinks = (props) => {
    const classes = useStyles();
    const iconMaps = {
        [WizardStepStatus.NotStarted]: 'SkypeCircleCheck',
        [WizardStepStatus.InProgress]: 'SkypeCircleClock',
        [WizardStepStatus.Started]: 'SkypeCircleClock',
        [WizardStepStatus.Completed]: 'SkypeCircleCheck',
        [WizardStepStatus.Error]: 'StatusErrorFull',
        [WizardStepStatus.Blocked]: 'BlockedSolid',
        [WizardStepStatus.Disabled]: 'SkypeCircleCheck'
    };
    const onStepClick = (item) => {
        const selectedStep = props.steps.find((step) => step.id.toString() === item.key);
        props.onStepLinkClick && props.onStepLinkClick(selectedStep);
    };
    const selectedLinkKey = props.selectedStep ? props.selectedStep.id.toString() : undefined;
    const getClassName = (status) => {
        let statuClassName = '';
        switch (status) {
            case WizardStepStatus.Completed:
                statuClassName = 'completed';
                break;
            case WizardStepStatus.Started:
                statuClassName = 'started';
                break;
            case WizardStepStatus.Blocked:
                statuClassName = 'blocked';
                break;
            case WizardStepStatus.Error:
                statuClassName = 'error';
                break;
            default:
                break;
        }
        return statuClassName;
    };
    const getStepSummaryComponent = (step) => {
        const { StepSummaryComponent } = step;
        return (step.StepSummaryComponent && (_jsx("div", Object.assign({ className: classes.stepDetails }, { children: _jsx(StepSummaryComponent, Object.assign({}, step), void 0) }), void 0)));
    };
    const mapWizardStepData = (wizardSteps = []) => {
        const steps = wizardSteps;
        const wizardLinks = [];
        steps.forEach((step) => {
            const navLink = {
                key: step.id.toString(),
                name: step.name,
                statusIcon: step.status ? iconMaps[step.status] : iconMaps[WizardStepStatus.NotStarted],
                icon: step.iconName,
                disabled: step.disabled,
                status: step.status,
                isCurrentItem: step.id.toString() === selectedLinkKey,
                stepData: step
            };
            const parentGroup = step.groupName
                ? wizardLinks.find((grp) => grp.name === step.groupName)
                : wizardLinks[0];
            if (parentGroup) {
                parentGroup.links.push(navLink);
            }
            else {
                const linkGroup = {
                    links: [],
                    name: step.groupName
                };
                linkGroup.links.push(navLink);
                wizardLinks.push(linkGroup);
            }
        });
        return wizardLinks;
    };
    const getWizardLinks = (wizardType, steps) => {
        const wizardLinks = mapWizardStepData(steps);
        return (wizardLinks &&
            wizardLinks.map((group, index) => (_jsx(Stack, Object.assign({ horizontal: wizardType === WizardType.Horizontal, className: classes.mainClass }, { children: !props.defaultStepLinksCollapse && wizardType === WizardType.Vertical && group.name ? (_jsx(Accordion, Object.assign({ headerText: group.name, accordionHeaderClass: classes.accordionHeader }, { children: group.links.map((link, index) => getWizardLink(wizardType, link, group.links, index)) }), void 0)) : (group.links.map((link, index) => getWizardLink(wizardType, link, group.links, index))) }), index))));
    };
    const getLinkStatus = (link) => {
        if (link.isCurrentItem) {
            return WizardStepStatus.InProgress;
        }
        else if (link.disabled) {
            return WizardStepStatus.Disabled;
        }
        else if (link.status) {
            return link.status;
        }
        else {
            return WizardStepStatus.NotStarted;
        }
    };
    const getStatusIcon = (link) => {
        return (_jsx(Icon, { className: link.isCurrentItem ? 'active' : getClassName(link.status), iconName: link.statusIcon
                ? link.isCurrentItem
                    ? iconMaps[WizardStepStatus.Started]
                    : link.statusIcon
                : iconMaps[WizardStepStatus.Blocked] }, void 0));
    };
    const getWizardLink = (wizardType, link, links, index) => {
        return (_jsxs(React.Fragment, { children: [_jsxs(Stack, Object.assign({ "aria-label": `${link.name}: ${WIZARD_STEP_STATUS_STRINGS[getLinkStatus(link)]}`, title: `${link.name}${props.hideStepStatusText ? ': ' + WIZARD_STEP_STATUS_STRINGS[getLinkStatus(link)] : ''}`, onClick: () => {
                        !link.disabled && onStepClick(link);
                    }, className: link.isCurrentItem
                        ? mergeClassNames([
                            wizardType === WizardType.Vertical
                                ? classes.stepClassActive
                                : classes.stepClassActiveHorizontal,
                            props.defaultStepLinksCollapse ? classes.collapseLink : '',
                            props.stepActiveClass
                        ])
                        : mergeClassNames([
                            classes.stepClass,
                            props.defaultStepLinksCollapse ? classes.collapseLink : '',
                            props.stepClass
                        ]) }, { children: [_jsxs("button", Object.assign({ type: "button", disabled: link.disabled }, { children: [!props.hideStepStatusConnector &&
                                    (props.defaultStepLinksCollapse
                                        ? !link.icon && getStatusIcon(link)
                                        : getStatusIcon(link)), link.icon && _jsx(Icon, { iconName: link.icon, className: 'active' }, void 0), !props.defaultStepLinksCollapse && (_jsx("span", Object.assign({ className: link.isCurrentItem
                                        ? mergeClassNames([classes.activeStep, props.wizardLinkTextClass])
                                        : mergeClassNames([classes.stepText, props.wizardLinkTextClass]) }, { children: link.name }), void 0))] }), void 0), !props.hideStepStatusConnector &&
                            !props.defaultStepLinksCollapse &&
                            wizardType === WizardType.Vertical &&
                            index !== links.length - 1 && (_jsxs(_Fragment, { children: [_jsx("div", { className: links[index + 1].status === WizardStepStatus.Completed &&
                                        (link === null || link === void 0 ? void 0 : link.status) === WizardStepStatus.Completed
                                        ? classes.connectorCompleted
                                        : link.status === WizardStepStatus.Completed
                                            ? classes.connectorSolid
                                            : classes.connectorDashed }, void 0), getStepSummaryComponent(link.stepData)] }, void 0))] }), link.key), wizardType === WizardType.Horizontal && index !== links.length - 1 && (_jsx(Stack, Object.assign({ className: classes.horizontalSeparator }, { children: _jsx(Icon, { iconName: "ChevronRight" }, void 0) }), void 0))] }, index));
    };
    return _jsx(Stack, { children: getWizardLinks(props.type, props.steps) }, void 0);
};
