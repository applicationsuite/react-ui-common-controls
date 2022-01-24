export var WizardStepStatus;
(function (WizardStepStatus) {
    WizardStepStatus[WizardStepStatus["NotStarted"] = 0] = "NotStarted";
    WizardStepStatus[WizardStepStatus["Started"] = 1] = "Started";
    WizardStepStatus[WizardStepStatus["Completed"] = 2] = "Completed";
    WizardStepStatus[WizardStepStatus["Error"] = 3] = "Error";
    WizardStepStatus[WizardStepStatus["Blocked"] = 4] = "Blocked";
    WizardStepStatus[WizardStepStatus["InProgress"] = 5] = "InProgress";
})(WizardStepStatus || (WizardStepStatus = {}));
export var WizardType;
(function (WizardType) {
    WizardType[WizardType["Vertical"] = 0] = "Vertical";
    WizardType[WizardType["Horizontal"] = 1] = "Horizontal";
})(WizardType || (WizardType = {}));
export const MAX_HORIZONTAL_STEPS = 20;
export const ORDER_COLUMN = 'order';
export const WIZARD_LOCALIZATION_CONSTANTS = {
    STEPS: { id: 'Core.Wizard.Steps', defaultMessage: 'Steps' }
};