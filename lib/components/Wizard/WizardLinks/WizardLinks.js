import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { Stack, Icon } from '@fluentui/react';
import { WizardType, WizardStepStatus } from '../Wizard.models';
import { wizardLinksStyles } from './WizardLinks.styles';
const useStyles = createUseStyles(wizardLinksStyles);
export const WizardLinks = (props) => {
    const classes = useStyles();
    const iconMaps = {
        [WizardStepStatus.NotStarted]: 'SkypeCircleCheck',
        [WizardStepStatus.InProgress]: 'SkypeCircleClock',
        [WizardStepStatus.Started]: 'SkypeCircleClock',
        [WizardStepStatus.Completed]: 'SkypeCircleCheck',
        [WizardStepStatus.Error]: 'StatusErrorFull',
        [WizardStepStatus.Blocked]: 'BlockedSolid'
    };
    const getWizardLinks = (wizardSteps = []) => {
        const steps = wizardSteps;
        const wizardLinks = [];
        steps.forEach((step) => {
            const navLink = {
                key: step.id.toString(),
                name: step.name,
                icon: step.status ? iconMaps[step.status] : iconMaps[WizardStepStatus.NotStarted],
                url: '',
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
    const mergeClassNames = (classNames) => classNames.filter((className) => !!className).join(' ');
    const getWizard = (links, type) => {
        const isHorizental = type === WizardType.Horizontal;
        return (_jsx(Stack, Object.assign({ horizontal: isHorizental, className: classes.mainClass }, { children: links.map((link, index) => (_jsx(_Fragment, { children: _jsxs(Stack, Object.assign({ onClick: () => {
                        !link.disabled && onStepClick(link);
                    }, horizontal: isHorizental, className: link.isCurrentItem && !isHorizental
                        ? props.stepActiveClass
                            ? mergeClassNames([classes.stepClassActive, props.stepActiveClass])
                            : classes.stepClassActive
                        : props.stepClass
                            ? mergeClassNames([classes.stepClass, props.stepClass])
                            : classes.stepClass }, { children: [_jsxs("button", Object.assign({ type: "button", disabled: link.disabled }, { children: [_jsx(Icon, { className: link.isCurrentItem ? 'active' : getClassName(link.status), iconName: link.icon
                                        ? link.isCurrentItem
                                            ? iconMaps[WizardStepStatus.Started]
                                            : link.icon
                                        : iconMaps[WizardStepStatus.Blocked] }, void 0), _jsx("span", Object.assign({ className: link.isCurrentItem
                                        ? mergeClassNames([classes.activeStep, props.wizardLinkTextClass])
                                        : mergeClassNames([classes.stepText, props.wizardLinkTextClass]) }, { children: link.name }), void 0)] }), void 0), index !== links.length - 1 && (_jsx(_Fragment, { children: isHorizental ? (_jsx("div", { className: links[index + 1].status === WizardStepStatus.Completed &&
                                    (link === null || link === void 0 ? void 0 : link.status) === WizardStepStatus.Completed
                                    ? classes.connectorCompletedHorizental
                                    : link.status === WizardStepStatus.Completed
                                        ? classes.connectorSolidHorizental
                                        : classes.connectorDashedHorizental }, void 0)) : (_jsxs("div", { children: [_jsx("div", { className: links[index + 1].status === WizardStepStatus.Completed &&
                                            (link === null || link === void 0 ? void 0 : link.status) === WizardStepStatus.Completed
                                            ? classes.connectorCompleted
                                            : link.status === WizardStepStatus.Completed
                                                ? classes.connectorSolid
                                                : classes.connectorDashed }, void 0), getStepSummaryComponent(link.stepData)] }, void 0)) }, void 0))] }), void 0) }, void 0))) }), void 0));
    };
    const wizardLinks = getWizardLinks(props.steps);
    return (_jsx(Stack, { children: wizardLinks &&
            wizardLinks.map((group) => (_jsxs(_Fragment, { children: [' ', group.name && props.type !== WizardType.Horizontal ? (_jsxs(_Fragment, { children: [_jsx("span", Object.assign({ className: classes.accordionHeader }, { children: (group === null || group === void 0 ? void 0 : group.name) ? group.name : '' }), void 0), getWizard(group.links, props.type)] }, void 0)) : (_jsx(_Fragment, { children: getWizard(group.links, props.type) }, void 0))] }, void 0))) }, void 0));
};
