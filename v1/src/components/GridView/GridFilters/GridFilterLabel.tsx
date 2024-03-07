import { createUseStyles } from 'react-jss';
import * as React from 'react';
import { filterLabelStyles } from './GridFilterLabel.styles';
import { Accordion } from '../../Accordion';

const useStyles = createUseStyles(filterLabelStyles);

export const GridFilterLabel: React.FC<{
  filterName: string;
  children: any;
  isFilterCollapsible?: boolean;
}> = ({ filterName, children, isFilterCollapsible }) => {
  const classes = useStyles();
  return (
    <div className="grid-filter-label">
      {isFilterCollapsible ? (
        <Accordion headerText={filterName}>{children}</Accordion>
      ) : (
        <>
          <div className={classes.filterLabel}>{filterName}</div>
          {children}
        </>
      )}
    </div>
  );
};
