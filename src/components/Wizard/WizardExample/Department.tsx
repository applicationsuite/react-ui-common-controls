import React, { useEffect } from 'react';
import { IWizardStep, IWizardStepData } from '../Wizard.models';

export const Department = (props: IWizardStep) => {
  useEffect(() => {
    props.registerCallbacks && props.registerCallbacks(onValidate, subscribeToDependency);
  }, [props.dependencies]);

  function onValidate(stepData: IWizardStepData, dependencyData?: IWizardStepData[]) {
    if (stepData.data.departmentName !== undefined) {
      stepData.valid = true;
    }
    return { ...stepData };
  }

  function subscribeToDependency(dependency: IWizardStepData) {
    console.log(dependency);
  }

  const onChange = (e: any) => {
    const step = { ...props };
    step.data.departmentName = e.target.value;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.departmentName
    };
    props.onChange && props.onChange(stepData);
    props.onNotifyChange && props.onNotifyChange(stepData);
  };

  const onNext = (e: any) => {
    const step = { ...props };
    step.data.departmentName = props.data.departmentName;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.departmentName
    };
    props.onSubmitClick && props.onSubmitClick(stepData);
  };

  const onPrevious = (e: any) => {
    const step = { ...props };
    step.data.departmentName = props.data.departmentName;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.departmentName
    };
    props.onPreviousClick && props.onPreviousClick(stepData);
  };

  return (
    <>
      Department: <input type="text" value={props.data.departmentName} onChange={onChange} />
      <button type="submit" onClick={onNext}>
        Next
      </button>
      <button type="button" onClick={onPrevious}>
        Previous
      </button>
    </>
  );
};
