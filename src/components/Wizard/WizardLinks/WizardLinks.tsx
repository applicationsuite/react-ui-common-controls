import React from 'react';
import { createUseStyles } from 'react-jss';
import { INavLinkGroup, INavLink, Stack, Icon } from '@fluentui/react';
import { IWizardProps, IWizardStep, WizardType, WizardStepStatus } from '../Wizard.models';
import { wizardLinksStyles } from './WizardLinks.styles';

const useStyles = createUseStyles(wizardLinksStyles);

export const WizardLinks: React.FC<IWizardProps> = (props) => {
  const classes = useStyles();

  const iconMaps = {
    [WizardStepStatus.NotStarted]: 'SkypeCircleCheck',
    [WizardStepStatus.InProgress]: 'SkypeCircleClock',
    [WizardStepStatus.Started]: 'SkypeCircleClock',
    [WizardStepStatus.Completed]: 'SkypeCircleCheck',
    [WizardStepStatus.Error]: 'StatusErrorFull',
    [WizardStepStatus.Blocked]: 'BlockedSolid'
  };

  const getWizardLinks = (wizardSteps: IWizardStep[] = []) => {
    const steps = wizardSteps;
    const wizardLinks: INavLinkGroup[] = [];
    steps.forEach((step) => {
      const navLink: INavLink = {
        key: step.id.toString(),
        name: step.name,
        icon: step.status ? iconMaps[step.status] : iconMaps[WizardStepStatus.NotStarted],
        url: '',
        disabled: step.disabled,
        status: step.status,
        isCurrentItem: step.id.toString() === selectedLinkKey,
        stepData: step
      };
      const parentGroup = step.groupName
        ? wizardLinks.find((grp) => grp.name === step.groupName)
        : wizardLinks[0];
      if (parentGroup) {
        parentGroup.links.push(navLink);
      } else {
        const linkGroup: INavLinkGroup = {
          links: [],
          name: step.groupName
        };
        linkGroup.links.push(navLink);

        wizardLinks.push(linkGroup);
      }
    });
    return wizardLinks;
  };

  const onStepClick = (item: any) => {
    const selectedStep = props.steps.find((step) => step.id.toString() === item.key);
    props.onStepLinkClick && props.onStepLinkClick(selectedStep!);
  };

  const selectedLinkKey = props.selectedStep ? props.selectedStep.id.toString() : undefined;

  const getClassName = (status: WizardStepStatus) => {
    let statuClassName = '';
    switch (status) {
      case WizardStepStatus.Completed:
        statuClassName = 'completed';
        break;
      case WizardStepStatus.Started:
        statuClassName = 'started';
        break;
      case WizardStepStatus.Blocked:
        statuClassName = 'blocked';
        break;
      case WizardStepStatus.Error:
        statuClassName = 'error';
        break;

      default:
        break;
    }
    return statuClassName;
  };

  const getStepSummaryComponent = (step: IWizardStep) => {
    const { StepSummaryComponent } = step;
    return (
      step.StepSummaryComponent && (
        <div className={classes.stepDetails}>
          <StepSummaryComponent {...step} />
        </div>
      )
    );
  };

  const mergeClassNames = (classNames: (string | undefined)[]) =>
    classNames.filter((className) => !!className).join(' ');

  const getWizard = (links: INavLink[], type: WizardType) => {
    const isHorizental = type === WizardType.Horizontal;

    return (
      <Stack horizontal={isHorizental} className={classes.mainClass}>
        {links.map((link, index) => (
          <>
            <Stack
              onClick={() => {
                !link.disabled && onStepClick(link);
              }}
              horizontal={isHorizental}
              className={
                link.isCurrentItem && !isHorizental
                  ? props.stepActiveClass
                    ? mergeClassNames([classes.stepClassActive, props.stepActiveClass])
                    : classes.stepClassActive
                  : props.stepClass
                  ? mergeClassNames([classes.stepClass, props.stepClass])
                  : classes.stepClass
              }
            >
              <button type="button" disabled={link.disabled}>
                <Icon
                  className={link.isCurrentItem ? 'active' : getClassName(link.status)}
                  iconName={
                    link.icon
                      ? link.isCurrentItem
                        ? iconMaps[WizardStepStatus.Started]
                        : link.icon
                      : iconMaps[WizardStepStatus.Blocked]
                  }
                />
               <span
                  className={
                    link.isCurrentItem
                      ? mergeClassNames([classes.activeStep, props.wizardLinkTextClass])
                      : mergeClassNames([classes.stepText, props.wizardLinkTextClass])
                  }
                >
                  {link.name}
                </span>
              </button>
              {index !== links.length - 1 && (
                <>
                  {isHorizental ? (
                    <div
                      className={
                        links[index + 1].status === WizardStepStatus.Completed &&
                        link?.status === WizardStepStatus.Completed
                          ? classes.connectorCompletedHorizental
                          : link.status === WizardStepStatus.Completed
                          ? classes.connectorSolidHorizental
                          : classes.connectorDashedHorizental
                      }
                    />
                  ) : (
                    <div>
                      <div
                        className={
                          links[index + 1].status === WizardStepStatus.Completed &&
                          link?.status === WizardStepStatus.Completed
                            ? classes.connectorCompleted
                            : link.status === WizardStepStatus.Completed
                            ? classes.connectorSolid
                            : classes.connectorDashed
                        }
                      />
                      {getStepSummaryComponent(link.stepData)}
                    </div>
                  )}
                </>
              )}
            </Stack>
          </>
        ))}
      </Stack>
    );
  };

  const wizardLinks = getWizardLinks(props.steps);

  return (
    <Stack>
      {wizardLinks &&
        wizardLinks.map((group) => (
          <>
            {' '}
            {group.name && props.type !== WizardType.Horizontal ? (
              <>
                <span className={classes.accordionHeader}>{group?.name ? group.name : ''}</span>
                {getWizard(group.links, props.type)}
              </>
            ) : (
              <>{getWizard(group.links, props.type)}</>
            )}
            {/* <SectionSeparator /> */}
          </>
        ))}
    </Stack>
  );
};
