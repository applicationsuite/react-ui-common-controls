import React, { useEffect } from 'react';
import { IWizardStep, IWizardStepData } from '../Wizard.models';

export const Employee = (props: IWizardStep) => {
  useEffect(() => {
    props.registerCallbacks && props.registerCallbacks(onValidate, subscribeToDependency);
  }, [props.dependencies]);

  function onValidate(stepData: IWizardStepData, dependencyData?: IWizardStepData[]) {
    if (stepData.data.empName !== undefined) {
      stepData.valid = true;
    }
    return { ...stepData };
  }

  function subscribeToDependency(dependency: IWizardStepData) {
    console.log(dependency);
  }

  const onChange = (e: any) => {
    const step = { ...props };
    step.data.empName = e.target.value;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.empName
    };
    props.onChange && props.onChange(stepData);
  };

  const onNext = (e: any) => {
    const step = { ...props };
    step.data.empName = props.data.empName;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.empName
    };
    props.onSubmitClick && props.onSubmitClick(stepData);
  };

  const onPrevious = (e: any) => {
    const step = { ...props };
    step.data.empName = props.data.empName;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.empName
    };
    props.onPreviousClick && props.onPreviousClick(stepData);
  };

  return (
    <>
      Employee: <input type="text" value={props.data.empName} onChange={onChange} />
      <button type="submit" onClick={onNext}>
        Next
      </button>
      <button type="button" onClick={onPrevious}>
        Previous
      </button>
    </>
  );
};
