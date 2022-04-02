import React from 'react';
import { createUseStyles } from 'react-jss';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import {
  IWizardProps,
  IWizardStep,
  WizardType,
  WizardStepStatus,
  IWizardStepLinkGroup,
  IWizardStepLink,
  WIZARD_STEP_STATUS_STRINGS
} from '../Wizard.models';
import { wizardLinksStyles } from './WizardLinks.styles';
import { Accordion } from '../../Accordion';
import { mergeClassNames } from '../../../utilities/mergeClassNames';

const useStyles = createUseStyles(wizardLinksStyles);

export const WizardLinks: React.FC<IWizardProps> = (props) => {
  const classes = useStyles();

  const iconMaps = {
    [WizardStepStatus.NotStarted]: 'SkypeCircleCheck',
    [WizardStepStatus.InProgress]: 'SkypeCircleClock',
    [WizardStepStatus.Started]: 'SkypeCircleClock',
    [WizardStepStatus.Completed]: 'SkypeCircleCheck',
    [WizardStepStatus.Error]: 'StatusErrorFull',
    [WizardStepStatus.Blocked]: 'BlockedSolid',
    [WizardStepStatus.Disabled]: 'SkypeCircleCheck'
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

  const mapWizardStepData = (wizardSteps: IWizardStep[] = []) => {
    const steps = wizardSteps;
    const wizardLinks: IWizardStepLinkGroup[] = [];
    steps.forEach((step) => {
      const navLink: IWizardStepLink = {
        key: step.id.toString(),
        name: step.name,
        statusIcon: step.status ? iconMaps[step.status] : iconMaps[WizardStepStatus.NotStarted],
        icon: step.iconName,
        disabled: step.disabled,
        status: step.status!,
        isCurrentItem: step.id.toString() === selectedLinkKey,
        stepData: step
      };
      const parentGroup = step.groupName
        ? wizardLinks.find((grp) => grp.name === step.groupName)
        : wizardLinks[0];
      if (parentGroup) {
        parentGroup.links.push(navLink);
      } else {
        const linkGroup: IWizardStepLinkGroup = {
          links: [],
          name: step.groupName
        };
        linkGroup.links.push(navLink);

        wizardLinks.push(linkGroup);
      }
    });
    return wizardLinks;
  };

  const getWizardLinks = (wizardType: WizardType, steps: IWizardStep[]) => {
    const wizardLinks = mapWizardStepData(steps);
    return (
      wizardLinks &&
      wizardLinks.map((group, index) => (
        <Stack
          key={index}
          horizontal={wizardType === WizardType.Horizontal}
          className={classes.mainClass}
        >
          {!props.defaultStepLinksCollapse && wizardType === WizardType.Vertical && group.name ? (
            <Accordion headerText={group.name} accordionHeaderClass={classes.accordionHeader}>
              {group.links.map((link, index) =>
                getWizardLink(wizardType, link, group.links, index)
              )}
            </Accordion>
          ) : (
            group.links.map((link, index) => getWizardLink(wizardType, link, group.links, index))
          )}
        </Stack>
      ))
    );
  };

  const getLinkStatus = (link: IWizardStepLink) => {
    if (link.isCurrentItem) {
      return WizardStepStatus.InProgress;
    } else if (link.disabled) {
      return WizardStepStatus.Disabled;
    } else if (link.status) {
      return link.status;
    } else {
      return WizardStepStatus.NotStarted;
    }
  };

  const getStatusIcon = (link: IWizardStepLink) => {
    return (
      <Icon
        className={link.isCurrentItem ? 'active' : getClassName(link.status)}
        iconName={
          link.statusIcon
            ? link.isCurrentItem
              ? iconMaps[WizardStepStatus.Started]
              : link.statusIcon
            : iconMaps[WizardStepStatus.Blocked]
        }
      />
    );
  };

  const getWizardLink = (
    wizardType: WizardType,
    link: IWizardStepLink,
    links: IWizardStepLink[],
    index: number
  ) => {
    return (
      <React.Fragment key={index}>
        <Stack
          aria-label={`${link.name}: ${WIZARD_STEP_STATUS_STRINGS[getLinkStatus(link)]}`}
          title={`${link.name}${
            props.hideStepStatusText ? ': ' + WIZARD_STEP_STATUS_STRINGS[getLinkStatus(link)] : ''
          }`}
          key={link.key}
          onClick={() => {
            !link.disabled && onStepClick(link);
          }}
          className={
            link.isCurrentItem
              ? mergeClassNames([
                  wizardType === WizardType.Vertical
                    ? classes.stepClassActive
                    : classes.stepClassActiveHorizontal,
                  props.defaultStepLinksCollapse ? classes.collapseLink : '',
                  props.stepActiveClass
                ])
              : mergeClassNames([
                  classes.stepClass,
                  props.defaultStepLinksCollapse ? classes.collapseLink : '',
                  props.stepClass
                ])
          }
        >
          <button type="button" disabled={link.disabled}>
            {!props.hideStepStatusConnector &&
              (props.defaultStepLinksCollapse
                ? !link.icon && getStatusIcon(link)
                : getStatusIcon(link))}
            {link.icon && <Icon iconName={link.icon} className={'active'} />}

            {!props.defaultStepLinksCollapse && (
              <span
                className={
                  link.isCurrentItem
                    ? mergeClassNames([classes.activeStep, props.wizardLinkTextClass])
                    : mergeClassNames([classes.stepText, props.wizardLinkTextClass])
                }
              >
                {link.name}
              </span>
            )}
          </button>
          {!props.hideStepStatusConnector &&
            !props.defaultStepLinksCollapse &&
            wizardType === WizardType.Vertical &&
            index !== links.length - 1 && (
              <>
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
              </>
            )}
        </Stack>
        {wizardType === WizardType.Horizontal && index !== links.length - 1 && (
          <Stack className={classes.horizontalSeparator}>
            <Icon iconName="ChevronRight" />
          </Stack>
        )}
      </React.Fragment>
    );
  };

  return <Stack>{getWizardLinks(props.type, props.steps)}</Stack>;
};
