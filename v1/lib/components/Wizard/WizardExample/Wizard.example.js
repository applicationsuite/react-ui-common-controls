import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Wizard } from '../Wizard';
import { WizardType } from '../Wizard.models';
import { Department } from './Department';
import { Employee } from './Employee';
import { Others } from './Others';
import { Salary } from './Salary';
const Summary = () => (_jsxs("div", { children: [_jsx("div", { children: "Selected step 1" }, void 0), _jsx("div", { children: "Info 1" }, void 0), _jsx("div", { children: "Info 2" }, void 0)] }, void 0));
export const WizardExample = () => {
    const getWizardSteps = () => {
        const steps = [
            //
            {
                id: '1',
                name: 'Step 1',
                StepComponent: Department,
                StepSummaryComponent: Summary,
                data: {
                    departmentName: 'test'
                }
            },
            {
                id: '2',
                name: 'Step 2',
                StepComponent: Employee,
                isNavigationBlocked: true,
                dependentStepIds: ['1']
            },
            {
                id: '3',
                name: 'Step 3',
                StepComponent: Salary,
                // dependentStepIds: [2]
                // disabled: true,
                groupName: 'First'
            },
            {
                id: '4',
                name: 'Step 4',
                // groupName: "Other Info",
                StepComponent: Others,
                // dependentStepIds: [1, 2, 3],
                groupName: 'First'
            }
        ];
        return steps;
    };
    const onWizardChange = (steps, currentStep, lastStep) => {
        console.log(steps);
        console.log(currentStep);
        console.log(lastStep);
    };
    return (_jsx("div", Object.assign({ style: { background: 'white', padding: '10px' } }, { children: _jsx(Wizard, Object.assign({ type: WizardType.Vertical, steps: getWizardSteps(), onWizardChange: onWizardChange }, { children: ' ' }), void 0) }), void 0));
};
