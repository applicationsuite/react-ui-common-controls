import React, { useEffect } from 'react';
import { IWizardStep, IWizardStepData } from '../Wizard.models';

export const Others = (props: IWizardStep) => {
  useEffect(() => {
    props.registerCallbacks && props.registerCallbacks(onValidate, subscribeToDependency);
  }, [props.dependencies]);

  function onValidate(stepData: IWizardStepData, dependencyData?: IWizardStepData[]) {
    if (stepData.data.comments !== undefined) {
      stepData.valid = true;
    }
    return { ...stepData };
  }

  function subscribeToDependency(dependency: IWizardStepData) {}

  const onChange = (e: any) => {
    const step = { ...props };
    step.data.comments = e.target.value;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.comments
    };
    props.onChange && props.onChange(stepData);
  };

  const onPrevious = (e: any) => {
    const step = { ...props };
    step.data.comments = props.data.comments;
    const stepData: IWizardStepData = {
      id: step.id,
      data: step.data,
      valid: !!step.data.comments
    };
    props.onPreviousClick && props.onPreviousClick(stepData);
  };

  return (
    <>
      Comments: <input type="string" value={props.data.comments} onChange={onChange} />
      <button type="button" onClick={onPrevious}>
        Previous
      </button>
    </>
  );
};
