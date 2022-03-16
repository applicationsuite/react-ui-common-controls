import React from 'react';
import { createUseStyles } from 'react-jss';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { IGridFilterProps } from '../GridView.models';
import { GridFilters } from './GridFilters';
import { gridFilterPanelStyles } from './GridFilterPanel.styles';

type CombinedProps = IGridFilterProps & {
  showFilters: boolean;
  toggleFilters: (showPanel: boolean) => void;
};

const useStyles = createUseStyles(gridFilterPanelStyles);

export const GridFilterPanel: React.FC<CombinedProps> = (props: CombinedProps) => {
  const classes = useStyles();
  const onRenderFooterContent = () => (
    <div className={classes.filterFooterBtns}>
      {props.onApplyFilters && (
        <PrimaryButton onClick={props.onApplyFilters} className={classes.applyBtn}>
          Apply
        </PrimaryButton>
      )}
      <DefaultButton onClick={() => props.toggleFilters(false)}>Close</DefaultButton>
    </div>
  );

  const panelType: PanelType = PanelType.smallFixedFar;
  return (
    <>
      <Panel
        isOpen={props.showFilters}
        onDismiss={() => props.toggleFilters(false)}
        type={panelType}
        headerText="Filters"
        closeButtonAriaLabel="Close"
        onRenderFooter={onRenderFooterContent}
        isFooterAtBottom
        className={classes.filterPanel}
      >
        <GridFilters filters={props.filters} onFilterChange={props.onFilterChange} />
      </Panel>
    </>
  );
};
