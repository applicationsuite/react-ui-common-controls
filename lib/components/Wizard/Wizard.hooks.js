import { useEffect, useReducer } from 'react';
import { wizardReducer } from './Wizard.reducers';
import { WIZARD_ACTIONS } from './Wizard.actions';
import { WizardStepStatus, ORDER_COLUMN } from './Wizard.models';
import { SORT_TYPE } from '../../constants';
import { sortValues } from '../../utilities';
export const useInit = (props) => {
    const [state, dispatch] = useReducer(wizardReducer, {});
    const actions = gridActions(dispatch, state);
    useEffect(() => {
        actions.initialize(props);
    }, [props.steps]);
    return { state: state, actions };
};
const gridActions = (dispatch, state) => {
    const actions = {
        initialize: (props) => {
            const selectedStep = props.selectedStep
                ? props.selectedStep
                : props.steps
                    ? props.steps[0]
                    : undefined;
            const initialData = {
                type: props.type,
                steps: props.steps,
                selectedStep,
                lastSelectedStep: selectedStep
            };
            props.steps &&
                props.steps.forEach((step) => {
                    step.data = step.data || {};
                    step.valid = step.valid;
                    step.dependencies = getWizardStepsData(props.steps.filter((item) => { var _a; return (_a = step.dependentStepIds) === null || _a === void 0 ? void 0 : _a.includes(item.id); }) || []);
                    if (!step.disabled) {
                        const isDependenciesHasError = step.isNavigationBlocked
                            ? step.dependencies.length
                                ? step.dependencies.filter((i) => i.valid === true).length !==
                                    step.dependencies.length
                                : false
                            : false;
                        step.disabled = isDependenciesHasError;
                    }
                });
            const steps = props.steps || [];
            initialData.steps = steps.sort((a, b) => sortValues(a[ORDER_COLUMN], b[ORDER_COLUMN], SORT_TYPE.ASC));
            dispatch({ type: WIZARD_ACTIONS.INITIALIZE, data: initialData });
        },
        registerCallbacks: (onValidate, subscribeToDependency) => {
            if (!state.selectedStep ||
                state.selectedStep.onValidate ||
                state.selectedStep.subscribeToDependency) {
                return;
            }
            state.selectedStep.onValidate = onValidate;
            state.selectedStep.subscribeToDependency = subscribeToDependency;
            const steps = getUpdatedStepsWithoutOnValidate(state.selectedStep, state.steps);
            dispatch({ type: WIZARD_ACTIONS.UPDATE_STEPS, data: steps });
            dispatch({
                type: WIZARD_ACTIONS.SET_CURRENT_STEP,
                data: state.selectedStep
            });
        },
        updateCurrentStep: (step, callback) => {
            var _a, _b, _c;
            if (((_a = state.selectedStep) === null || _a === void 0 ? void 0 : _a.id) === step.id) {
                return;
            }
            if (state.selectedStep) {
                const stepData = ((_b = state.selectedStep) === null || _b === void 0 ? void 0 : _b.onValidate) &&
                    ((_c = state.selectedStep) === null || _c === void 0 ? void 0 : _c.onValidate(getWizardStepData(state.selectedStep), state.selectedStep.dependencies));
                state.selectedStep.valid = stepData === null || stepData === void 0 ? void 0 : stepData.valid;
                state.selectedStep.status = getStepStatus(stepData === null || stepData === void 0 ? void 0 : stepData.valid);
                state.selectedStep.data = stepData === null || stepData === void 0 ? void 0 : stepData.data;
            }
            const steps = getUpdatedSteps(state.selectedStep, state.steps);
            const currentStep = steps.find((wizardStep) => wizardStep.id === step.id);
            currentStep.status = WizardStepStatus.Started;
            dispatch({ type: WIZARD_ACTIONS.UPDATE_STEPS, data: steps });
            dispatch({
                type: WIZARD_ACTIONS.SET_LAST_STEP,
                data: state.selectedStep
            });
            callback && callback(steps, currentStep, state.selectedStep);
            dispatch({
                type: WIZARD_ACTIONS.SET_CURRENT_STEP,
                data: currentStep
            });
        },
        updateWizardStep: (step, callback) => {
            const steps = getUpdatedSteps(step, state.steps);
            const currentStep = steps.find((item) => item.id === step.id);
            dispatch({ type: WIZARD_ACTIONS.UPDATE_STEPS, data: steps });
            callback && callback(steps, currentStep, state.selectedStep);
            dispatch({
                type: WIZARD_ACTIONS.SET_CURRENT_STEP,
                data: currentStep
            });
        },
        submitStep: (step, callback) => {
            step.status = getStepStatus(step.valid);
            const steps = getUpdatedSteps(step, state.steps);
            const nextStep = getNextStep(step, steps);
            if (!nextStep) {
                return;
            }
            nextStep.status = WizardStepStatus.Started;
            const currentStep = steps.find((wizardStep) => wizardStep.id === nextStep.id);
            dispatch({ type: WIZARD_ACTIONS.UPDATE_STEPS, data: steps });
            dispatch({ type: WIZARD_ACTIONS.SET_LAST_STEP, data: currentStep });
            dispatch({ type: WIZARD_ACTIONS.SET_CURRENT_STEP, data: nextStep });
            callback && callback(steps, nextStep, currentStep);
        },
        previousStep: (step, callback) => {
            step.status = getStepStatus(step.valid);
            const steps = getUpdatedSteps(step, state.steps);
            const prevStep = getPreviousStep(step, steps);
            if (!prevStep) {
                return;
            }
            prevStep.status = WizardStepStatus.Started;
            const currentStep = steps.find((wizardStep) => wizardStep.id === prevStep.id);
            dispatch({ type: WIZARD_ACTIONS.UPDATE_STEPS, data: steps });
            dispatch({ type: WIZARD_ACTIONS.SET_LAST_STEP, data: currentStep });
            dispatch({ type: WIZARD_ACTIONS.SET_CURRENT_STEP, data: prevStep });
            callback && callback(steps, prevStep, currentStep);
        },
        onNotifyChange: (stepData) => {
            const dependencySteps = state.steps.filter((item) => { var _a; return (_a = item.dependentStepIds) === null || _a === void 0 ? void 0 : _a.includes(stepData.id); });
            dependencySteps.forEach((item) => {
                item.subscribeToDependency && item.subscribeToDependency(stepData);
            });
        }
    };
    return actions;
};
const getUpdatedSteps = (step, stepsData) => {
    let steps = updateStepsForStep(step, stepsData);
    const dependencySteps = steps.filter((item) => { var _a; return (_a = item.dependentStepIds) === null || _a === void 0 ? void 0 : _a.includes(step.id); });
    dependencySteps.forEach((item) => {
        item.dependencies = getWizardStepsData(steps.filter((x) => { var _a; return (_a = item.dependentStepIds) === null || _a === void 0 ? void 0 : _a.includes(x.id); }) || []);
        item.disabled = item.isNavigationBlocked
            ? item.dependencies.length
                ? item.dependencies.filter((i) => i.valid === true).length !== item.dependencies.length
                : false
            : false;
        item.status = item.disabled ? WizardStepStatus.Blocked : item.status;
        const updatedItem = item.onValidate && item.onValidate(item, item.dependencies);
        if (updatedItem) {
            item.data = updatedItem.data;
            item.valid = updatedItem.valid;
            item.status = item.disabled ? WizardStepStatus.Blocked : getStepStatus(updatedItem.valid);
            steps = updateStepsForStep(updatedItem, steps);
        }
    });
    return steps;
};
const getUpdatedStepsWithoutOnValidate = (step, stepsData) => {
    const steps = updateStepsForStep(step, stepsData);
    const dependencySteps = steps.filter((item) => { var _a; return (_a = item.dependentStepIds) === null || _a === void 0 ? void 0 : _a.includes(step.id); });
    dependencySteps.forEach((item) => {
        item.dependencies = getWizardStepsData(steps.filter((x) => { var _a; return (_a = item.dependentStepIds) === null || _a === void 0 ? void 0 : _a.includes(x.id); }) || []);
    });
    return steps;
};
const getWizardStepsData = (wizardSteps) => {
    let stepDependencyData = wizardSteps.map((i) => ({
        id: i.id,
        data: i.data,
        valid: i.valid
    }));
    return stepDependencyData;
};
const getWizardStepData = (wizardStep) => {
    const stepData = {
        id: wizardStep.id,
        data: wizardStep.data,
        valid: wizardStep.valid
    };
    return stepData;
};
const getStepStatus = (isStepValid) => {
    if (isStepValid === undefined) {
        return WizardStepStatus.Started;
    }
    else if (isStepValid === true) {
        return WizardStepStatus.Completed;
    }
    else if (isStepValid === false) {
        return WizardStepStatus.Error;
    }
    return WizardStepStatus.NotStarted;
};
const updateStepsForStep = (step, steps) => {
    const index = steps.findIndex((i) => i.id === step.id);
    if (index > -1) {
        steps[index].valid = step.valid;
        steps[index].data = step.data;
        steps[index].status = step.status;
    }
    return steps;
};
const getNextStep = (step, steps) => {
    let index = steps.findIndex((i) => i.id === step.id);
    index += 1;
    while (index < steps.length && steps[index].disabled) {
        index += 1;
    }
    if (index < steps.length) {
        return steps[index];
    }
    return null;
};
const getPreviousStep = (step, steps) => {
    let index = steps.findIndex((i) => i.id === step.id);
    index -= 1;
    while (index >= 0 && steps[index].disabled) {
        index -= 1;
    }
    if (index >= 0) {
        return steps[index];
    }
    return null;
};
