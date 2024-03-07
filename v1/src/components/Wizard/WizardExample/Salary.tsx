import React, { useEffect } from 'react';
import { IWizardStep, IWizardStepData } from '../Wizard.models';

export const Salary = (props: IWizardStep) => {
  useEffect(() => {
    props.registerCallbacks && props.registerCallbacks(onValidate, subscribeToDependency);
  }, [props.dependencies]);

  function onValidate(stepData: IWizardStepData, dependencyData?: IWizardStepData[]) {
    if (stepData.data.salary !== undefined) {
      stepData.valid = true;
    }
    return { ...stepData };
  }

  function subscribeToDependency(dependency: IWizardStepData) {}

  const onChange = (e: any) => {
    const step = { ...props };
    step.data.salary = e.target.value;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.salary
    };
    props.onChange && props.onChange(stepData);
  };

  const onNext = (e: any) => {
    const step = { ...props };
    step.data.salary = props.data.salary;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.salary
    };
    props.onSubmitClick && props.onSubmitClick(stepData);
  };

  const onPrevious = (e: any) => {
    const step = { ...props };
    step.data.salary = props.data.salary;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.salary
    };
    props.onPreviousClick && props.onPreviousClick(stepData);
  };

  return (
    <>
      Salary: <input type="number" value={props.data.salary} onChange={onChange} />
      <button type="submit" onClick={onNext}>
        Next
      </button>
      <button type="button" onClick={onPrevious}>
        Previous
      </button>
    </>
  );
};
