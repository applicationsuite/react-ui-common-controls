export var WizardStepStatus;
(function (WizardStepStatus) {
    WizardStepStatus[WizardStepStatus["NotStarted"] = 0] = "NotStarted";
    WizardStepStatus[WizardStepStatus["Started"] = 1] = "Started";
    WizardStepStatus[WizardStepStatus["Completed"] = 2] = "Completed";
    WizardStepStatus[WizardStepStatus["Error"] = 3] = "Error";
    WizardStepStatus[WizardStepStatus["Blocked"] = 4] = "Blocked";
    WizardStepStatus[WizardStepStatus["InProgress"] = 5] = "InProgress";
    WizardStepStatus[WizardStepStatus["Disabled"] = 6] = "Disabled";
})(WizardStepStatus || (WizardStepStatus = {}));
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
export var WizardType;
(function (WizardType) {
    WizardType[WizardType["Vertical"] = 0] = "Vertical";
    WizardType[WizardType["Horizontal"] = 1] = "Horizontal";
})(WizardType || (WizardType = {}));
