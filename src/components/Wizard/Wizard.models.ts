export enum WizardStepStatus {
  NotStarted = 0,
  Started = 1,
  Completed = 2,
  Error = 3,
  Blocked = 4,
  InProgress = 5,
  Disabled = 6
}

export const MAX_HORIZONTAL_STEPS = 20;
export const ORDER_COLUMN = 'order';

export const WIZARD_LOCALIZATION_CONSTANTS = {
  STEPS: { id: 'Core.Wizard.Steps', defaultMessage: 'Steps' }
};

export const WIZARD_STEP_STATUS_STRINGS = {
  [WizardStepStatus.NotStarted]: 'Not Started',
  [WizardStepStatus.Started]: 'Started',
  [WizardStepStatus.Completed]: 'Completed',
  [WizardStepStatus.Error]: 'Error',
  [WizardStepStatus.Blocked]: 'Blocked',
  [WizardStepStatus.InProgress]: 'In Progress',
  [WizardStepStatus.Disabled]: 'Disabled'
};

export enum WizardType {
  Vertical = 0,
  Horizontal = 1
}

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
  iconName?: string;
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
  defaultStepLinksCollapse?: boolean;
  stepClass?: string;
  stepActiveClass?: string;
  wizardLinksClass?: string;
  wizardContainerClass?: string;
  wizardLinkTextClass?: string;
}

export interface IWizardStepLinkGroup {
  name?: string;
  links: IWizardStepLink[];
}

export interface IWizardStepLink {
  key: string;
  name: string;
  icon?: string;
  disabled?: boolean;
  status: WizardStepStatus;
  isCurrentItem: boolean;
  stepData: IWizardStep;
}
