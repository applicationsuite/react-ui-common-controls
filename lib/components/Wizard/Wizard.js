import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { Stack } from '@fluentui/react';
import { WizardType } from './Wizard.models';
import { wizardStyles } from './Wizard.styles';
import { WizardLinks } from './WizardLinks';
import { useInit } from './Wizard.hooks';
import { mergeClassNames } from '../../';
const useStyles = createUseStyles(wizardStyles);
export const Wizard = (props) => {
    const classes = useStyles();
    const stackTokens = { childrenGap: 20 };
    const { state, actions } = useInit(props);
    const onStepLinkClick = (step) => {
        actions.updateCurrentStep(step, props.onWizardChange);
    };
    const initializeStepCallbacks = () => { };
    const getWizardLinks = () => (_jsx(WizardLinks, { type: props.type, steps: state.steps, selectedStep: state.selectedStep, onStepLinkClick: onStepLinkClick }, void 0));
    const registerCallbacks = (onValidate, subscribeToDependency) => {
        actions.registerCallbacks(onValidate, subscribeToDependency);
    };
    const onChange = (step) => {
        actions.updateWizardStep(step, props.onWizardChange);
    };
    const onSubmitClick = (step) => {
        actions.submitStep(step, props.onWizardChange);
    };
    const onPreviousClick = (step) => {
        actions.previousStep(step, props.onWizardChange);
    };
    const onNotifyChange = (step) => {
        actions.onNotifyChange(step);
    };
    const getStepComponent = () => {
        var _a;
        const StepComponent = (_a = state.selectedStep) === null || _a === void 0 ? void 0 : _a.StepComponent;
        if (!StepComponent)
            return null;
        return (_jsx(StepComponent, Object.assign({}, state.selectedStep, { onChange: onChange, onPreviousClick: onPreviousClick, onSubmitClick: onSubmitClick, registerCallbacks: registerCallbacks, onNotifyChange: onNotifyChange }), void 0));
    };
    const getVerticalWizard = () => {
        let wizardLinksClass = mergeClassNames([classes.wizardLinks, props.wizardLinksClass]);
        let wizardContainerClass = mergeClassNames([
            classes.wizardContainer,
            props.wizardContainerClass
        ]);
        return (_jsxs(Stack, Object.assign({ horizontal: true, tokens: stackTokens, className: classes.wizardVertical }, { children: [_jsx(Stack.Item, Object.assign({ align: "stretch", grow: true, className: wizardLinksClass }, { children: getWizardLinks() }), void 0), _jsx(Stack.Item, Object.assign({ grow: true, className: classes.wizardDivider }, { children: _jsx("div", {}, void 0) }), void 0), _jsx(Stack.Item, Object.assign({ align: "stretch", grow: true, className: wizardContainerClass }, { children: getStepComponent() }), void 0)] }), void 0));
    };
    const getHorizontalWizard = () => (_jsxs(Stack, { children: [_jsx(Stack.Item, Object.assign({ align: "center" }, { children: getWizardLinks() }), void 0), _jsx(Stack.Item, Object.assign({ align: "auto" }, { children: getStepComponent() }), void 0)] }, void 0));
    if (!state.steps) {
        return null;
    }
    const wizard = props.type === WizardType.Vertical ? getVerticalWizard() : getHorizontalWizard();
    return wizard;
};
