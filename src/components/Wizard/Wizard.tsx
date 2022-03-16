import React from 'react';
import { createUseStyles } from 'react-jss';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { IconButton } from '@fluentui/react/lib/Button';
import { IWizardProps, IWizardStep, WizardType, IWizardStepData } from './Wizard.models';
import { wizardStyles } from './Wizard.styles';
import { WizardLinks } from './WizardLinks';
import { useInit } from './Wizard.hooks';
import { mergeClassNames } from '../../utilities/mergeClassNames';

const useStyles = createUseStyles(wizardStyles);

export const Wizard: React.FC<IWizardProps> = (props) => {
  const classes = useStyles();

  const stackTokens: IStackTokens = { childrenGap: 20 };

  const { state, actions } = useInit(props);
  const [isCollpased, setCollapsed] = React.useState(props.defaultStepLinksCollapse);

  const onStepLinkClick = (step: IWizardStep) => {
    actions.updateCurrentStep(step, props.onWizardChange);
  };

  const initializeStepCallbacks = () => {};

  const getWizardLinks = () => (
    <WizardLinks
      type={props.type}
      steps={state.steps}
      selectedStep={state.selectedStep}
      onStepLinkClick={onStepLinkClick}
      defaultStepLinksCollapse={isCollpased}
    />
  );

  const registerCallbacks = (
    onValidate?: (step: IWizardStepData, dependencies?: IWizardStepData[]) => IWizardStep,
    subscribeToDependency?: (dependency: IWizardStepData) => void
  ) => {
    actions.registerCallbacks(onValidate, subscribeToDependency);
  };

  const onChange = (step: IWizardStepData) => {
    actions.updateWizardStep(step, props.onWizardChange);
  };

  const onSubmitClick = (step: IWizardStepData) => {
    actions.submitStep(step, props.onWizardChange);
  };

  const onPreviousClick = (step: IWizardStepData) => {
    actions.previousStep(step, props.onWizardChange);
  };

  const onNotifyChange = (step: IWizardStepData) => {
    actions.onNotifyChange(step);
  };

  const onStepsCollapseExpandToggle = () => {
    setCollapsed(!isCollpased);
  };

  const getStepComponent = () => {
    const StepComponent = state.selectedStep?.StepComponent;
    if (!StepComponent) return null;
    return (
      <StepComponent
        {...state.selectedStep}
        onChange={onChange}
        onPreviousClick={onPreviousClick}
        onSubmitClick={onSubmitClick}
        registerCallbacks={registerCallbacks}
        onNotifyChange={onNotifyChange}
      />
    );
  };

  const getVerticalWizard = () => {
    let wizardLinksClass = mergeClassNames([
      isCollpased ? classes.wizardLinksCollapsed : classes.wizardLinks,
      props.wizardLinksClass
    ]);
    let wizardContainerClass = mergeClassNames([
      classes.wizardContainer,
      props.wizardContainerClass
    ]);
    return (
      <Stack horizontal tokens={stackTokens} className={classes.wizardVertical}>
        <Stack.Item align="stretch" grow className={wizardLinksClass}>
          {getWizardLinks()}
          <div
            className={
              isCollpased
                ? classes.stepCollapseExpandSectionCollapsed
                : classes.stepCollapseExpandSection
            }
          >
            <IconButton
              iconProps={{
                iconName: isCollpased ? 'DoubleChevronLeftMedMirrored' : 'DoubleChevronLeftMed'
              }}
              title={isCollpased ? 'click to expand' : 'click to collapse'}
              ariaLabel={isCollpased ? 'click to expand' : 'click to collapse'}
              onClick={onStepsCollapseExpandToggle}
            />
          </div>
        </Stack.Item>
        <Stack.Item grow className={classes.wizardDivider}>
          <div />
        </Stack.Item>
        <Stack.Item align="stretch" grow className={wizardContainerClass}>
          {getStepComponent()}
        </Stack.Item>
      </Stack>
    );
  };

  const getHorizontalWizard = () => (
    <Stack>
      <Stack.Item align="center">{getWizardLinks()}</Stack.Item>
      <Stack.Item align="auto">{getStepComponent()}</Stack.Item>
    </Stack>
  );
  if (!state.steps) {
    return null;
  }
  const wizard = props.type === WizardType.Vertical ? getVerticalWizard() : getHorizontalWizard();
  return wizard;
};
