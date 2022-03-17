export declare enum WizardStepStatus {
    NotStarted = 0,
    Started = 1,
    Completed = 2,
    Error = 3,
    Blocked = 4,
    InProgress = 5,
    Disabled = 6
}
export declare const MAX_HORIZONTAL_STEPS = 20;
export declare const ORDER_COLUMN = "order";
export declare const WIZARD_LOCALIZATION_CONSTANTS: {
    STEPS: {
        id: string;
        defaultMessage: string;
    };
};
export declare const WIZARD_STEP_STATUS_STRINGS: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
};
export declare enum WizardType {
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
    dependencies?: IWizardStepData[];
    status?: WizardStepStatus;
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
    onChange?: (step: IWizardStepData) => void;
    registerCallbacks?: (onValidate?: (stepData: IWizardStepData, dependencyData?: IWizardStepData[]) => IWizardStepData, subscribeToDependency?: (dependency: IWizardStepData) => void) => void;
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
    onWizardChange?: (steps: IWizardStep[], currentStep?: IWizardStep, lastStep?: IWizardStep) => void;
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
