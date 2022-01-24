import { useEffect, useReducer } from 'react';
import { wizardReducer } from './Wizard.reducers';
import { WIZARD_ACTIONS, IWizardActions } from './Wizard.actions';
import {
  IWizardData,
  IWizardProps,
  IWizardStep,
  WizardStepStatus,
  IWizardStepData,
  ORDER_COLUMN
} from './Wizard.models';
import { SORT_TYPE, sortValues } from '../../';

export const useInit = (props: IWizardProps) => {
  const [state, dispatch] = useReducer(wizardReducer, {});
  const actions = gridActions(dispatch, state) as IWizardActions;

  useEffect(() => {
    actions.initialize(props);
  }, [props.steps]);
  return { state: state as IWizardData, actions };
};

const gridActions = (dispatch: any, state: IWizardData) => {
  const actions: IWizardActions = {
    initialize: (props: IWizardProps) => {
      const selectedStep = props.selectedStep
        ? props.selectedStep
        : props.steps
        ? props.steps[0]
        : undefined;

      const initialData: IWizardData = {
        type: props.type,
        steps: props.steps,
        selectedStep,
        lastSelectedStep: selectedStep
      };
      props.steps &&
        props.steps.forEach((step) => {
          step.data = step.data || {};
          step.valid = step.valid;
          step.dependencies = getWizardStepsData(
            props.steps.filter((item) => step.dependentStepIds?.includes(item.id)) || []
          );
          if (!step.disabled) {
            const isDependenciesHasError = step.isNavigationBlocked
              ? step.dependencies!.length
                ? step.dependencies!.filter((i) => i.valid === true).length !==
                  step.dependencies!.length
                : false
              : false;
            step.disabled = isDependenciesHasError;
          }
        });
      const steps = props.steps || [];
      initialData.steps = steps.sort((a, b) =>
        sortValues(a[ORDER_COLUMN], b[ORDER_COLUMN], SORT_TYPE.ASC)
      );
      dispatch({ type: WIZARD_ACTIONS.INITIALIZE, data: initialData });
    },
    registerCallbacks: (
      onValidate?: (
        stepData: IWizardStepData,
        dependencyData?: IWizardStepData[]
      ) => IWizardStepData,
      subscribeToDependency?: (dependency: IWizardStepData) => void
    ) => {
      if (
        !state.selectedStep ||
        state.selectedStep.onValidate ||
        state.selectedStep.subscribeToDependency
      ) {
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
    updateCurrentStep: (
      step: IWizardStep,
      callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
    ) => {
      if (state.selectedStep?.id === step.id) {
        return;
      }
      if (state.selectedStep) {
        const stepData =
          state.selectedStep?.onValidate &&
          state.selectedStep?.onValidate(
            getWizardStepData(state.selectedStep),
            state.selectedStep.dependencies
          );

        state.selectedStep.valid = stepData?.valid;
        state.selectedStep.status = getStepStatus(stepData?.valid);
        state.selectedStep.data = stepData?.data;
      }
      const steps = getUpdatedSteps(state.selectedStep!, state.steps);
      const currentStep = steps.find((wizardStep) => wizardStep.id === step.id);
      currentStep!.status = WizardStepStatus.Started;

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
    updateWizardStep: (
      step: IWizardStepData,
      callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
    ) => {
      const steps = getUpdatedSteps(step, state.steps);
      const currentStep = steps.find((item) => item.id === step.id);
      dispatch({ type: WIZARD_ACTIONS.UPDATE_STEPS, data: steps });
      callback && callback(steps, currentStep, state.selectedStep);
      dispatch({
        type: WIZARD_ACTIONS.SET_CURRENT_STEP,
        data: currentStep
      });
    },
    submitStep: (
      step: IWizardStepData,
      callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
    ) => {
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
    previousStep: (
      step: IWizardStepData,
      callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
    ) => {
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
    onNotifyChange: (stepData: IWizardStepData) => {
      const dependencySteps = state.steps.filter((item) =>
        item.dependentStepIds?.includes(stepData.id)
      );
      dependencySteps.forEach((item) => {
        item.subscribeToDependency && item.subscribeToDependency(stepData);
      });
    }
  };
  return actions;
};

const getUpdatedSteps = (step: IWizardStepData, stepsData: IWizardStep[]) => {
  let steps = updateStepsForStep(step, stepsData);
  const dependencySteps = steps.filter((item) => item.dependentStepIds?.includes(step.id));
  dependencySteps.forEach((item) => {
    item.dependencies = getWizardStepsData(
      steps.filter((x) => item.dependentStepIds?.includes(x.id)) || []
    );
    item.disabled = item.isNavigationBlocked
      ? item.dependencies!.length
        ? item.dependencies!.filter((i) => i.valid === true).length !== item.dependencies!.length
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

const getUpdatedStepsWithoutOnValidate = (step: IWizardStepData, stepsData: IWizardStep[]) => {
  const steps = updateStepsForStep(step, stepsData);
  const dependencySteps = steps.filter((item) => item.dependentStepIds?.includes(step.id));
  dependencySteps.forEach((item) => {
    item.dependencies = getWizardStepsData(
      steps.filter((x) => item.dependentStepIds?.includes(x.id)) || []
    );
  });
  return steps;
};

const getWizardStepsData = (wizardSteps: IWizardStep[]) => {
  let stepDependencyData: IWizardStepData[] = wizardSteps.map((i) => ({
    id: i.id,
    data: i.data,
    valid: i.valid
  }));
  return stepDependencyData;
};

const getWizardStepData = (wizardStep: IWizardStep) => {
  const stepData: IWizardStepData = {
    id: wizardStep.id,
    data: wizardStep.data,
    valid: wizardStep.valid
  };
  return stepData;
};

const getStepStatus = (isStepValid?: boolean) => {
  if (isStepValid === undefined) {
    return WizardStepStatus.Started;
  } else if (isStepValid === true) {
    return WizardStepStatus.Completed;
  } else if (isStepValid === false) {
    return WizardStepStatus.Error;
  }
  return WizardStepStatus.NotStarted;
};

const updateStepsForStep = (step: IWizardStepData, steps: IWizardStep[]) => {
  const index = steps.findIndex((i) => i.id === step.id);
  if (index > -1) {
    steps[index].valid = step.valid;
    steps[index].data = step.data;
    steps[index].status = step.status;
  }
  return steps;
};

const getNextStep = (step: IWizardStepData, steps: IWizardStep[]) => {
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

const getPreviousStep = (step: IWizardStepData, steps: IWizardStep[]) => {
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
