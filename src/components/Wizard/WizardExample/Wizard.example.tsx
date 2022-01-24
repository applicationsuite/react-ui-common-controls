import React from 'react';
import { createUseStyles } from 'react-jss';
import { WizardStepStatus, IWizardStepData } from '..';
import { Wizard } from '../Wizard';
import { IWizardStep, WizardType } from '../Wizard.models';
import { Department } from './Department';
import { Employee } from './Employee';
import { Others } from './Others';
import { Salary } from './Salary';

const Summary = () => (
  <div>
    <div>Selected step 1</div>
    <div>Info 1</div>
    <div>Info 2</div>
  </div>
);

export const WizardExample = () => {
  const getWizardSteps = () => {
    const steps: IWizardStep[] = [
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

  const onWizardChange = (
    steps: IWizardStep[],
    currentStep?: IWizardStep,
    lastStep?: IWizardStep
  ) => {
    console.log(steps);
    console.log(currentStep);
    console.log(lastStep);
  };

  return (
    <div style={{ background: 'white', padding: '10px' }}>
      <Wizard type={WizardType.Vertical} steps={getWizardSteps()} onWizardChange={onWizardChange}>
        {' '}
      </Wizard>
    </div>
  );
};
