export enum WizardStepStatus {
  NotStarted = 0,
  Started = 1,
  Completed = 2,
  Error = 3,
  Blocked = 4,
  InProgress = 5
}

export enum WizardType {
  Vertical = 0,
  Horizontal = 1
}

export const MAX_HORIZONTAL_STEPS = 20;
export const ORDER_COLUMN = 'order';

export const WIZARD_LOCALIZATION_CONSTANTS = {
  STEPS: { id: 'Core.Wizard.Steps', defaultMessage: 'Steps' }
};

export interface IWizardData {
  type: WizardType;
  steps: IWizardStep[];
  lastSelectedStep?: IWizardStep;
  selectedStep?: IWizardStep;
}

export interface IWizardStepData {
  id: string;
  valid?: boolean;
  data?: any;
  dependencies?: IWizardStepData[]; // this is auto populated via onChange and need not to be changed at each component level
  status?: WizardStepStatus; // its manipulated at run time
}

export interface IWizardStep extends IWizardStepData {
  groupName?: string;
  name: string;
  order?: number;
  disabled?: boolean;
  dependentStepIds?: string[];
  isNavigationBlocked?: boolean;
  StepComponent: any;
  StepSummaryComponent?: any;
  onChange?: (step: IWizardStepData) => void; // This events indivisual step component will call upon data change
  registerCallbacks?: (
    onValidate?: (stepData: IWizardStepData, dependencyData?: IWizardStepData[]) => IWizardStepData,
    subscribeToDependency?: (dependency: IWizardStepData) => void
  ) => void; // Individual Step component will initialize their validate method so that it can be called during data validation
  onValidate?: (step: IWizardStepData, dependencies?: IWizardStepData[]) => IWizardStepData;
  subscribeToDependency?: (step: IWizardStepData) => void;
  onNotifyChange?: (step: IWizardStepData) => void;
  onSubmitClick?: (step: IWizardStepData) => void;
  onPreviousClick?: (step: IWizardStepData) => void;
}

export interface IWizardProps {
  type: WizardType;
  steps: IWizardStep[];
  selectedStep?: IWizardStep;
  onRenderStepLink?: () => any;
  onStepLinkClick?: (step: IWizardStep) => void;
  wizardAriaLabel?: string;
  onWizardChange?: (
    steps: IWizardStep[],
    currentStep?: IWizardStep,
    lastStep?: IWizardStep
  ) => void;
  stepClass?: string;
  stepActiveClass?: string;
  wizardLinksClass?: string;
  wizardContainerClass?: string;
}
