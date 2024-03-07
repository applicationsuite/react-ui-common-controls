import { IWizardProps, IWizardStep, IWizardStepData } from './Wizard.models';

export const WIZARD_ACTIONS = {
  INITIALIZE: 'initialize',
  SET_CURRENT_STEP: 'setCurrentStep',
  SET_LAST_STEP: 'setLastStep',
  UPDATE_STEPS: 'updateSteps'
};

export interface IWizardActions {
  initialize: (props: IWizardProps) => void;
  updateCurrentStep: (
    step: IWizardStep,
    callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
  ) => void;
  registerCallbacks: (
    onValidate?: (stepData: IWizardStepData, dependencyData?: IWizardStepData[]) => IWizardStepData,
    subscribeToDependency?: (dependency: IWizardStepData) => void
  ) => void;
  updateWizardStep: (
    step: IWizardStepData,
    callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
  ) => void;
  submitStep: (
    step: IWizardStepData,
    callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
  ) => void;
  previousStep: (
    step: IWizardStepData,
    callback?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void
  ) => void;
  onNotifyChange: (stepData: IWizardStepData) => void;
}
