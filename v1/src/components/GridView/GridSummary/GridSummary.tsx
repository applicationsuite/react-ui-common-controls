import React from 'react';
import { createUseStyles } from 'react-jss';
import { ISummaryParams } from '../GridView.models';
import { gridSummaryStyles } from './GridSummary.styles';

const useStyles = createUseStyles(gridSummaryStyles);

export const GridSummary: React.FC<ISummaryParams> = (props) => {
  const classes = useStyles();

  const { pageNumber, pageSize, totalCount, selectionCount = 0 } = props;

  const getPaginationSummary = (pageNumber: number, pageSize: number, totalCount: number) => {
    const startIndex = (pageNumber! - 1) * pageSize! + 1;
    const endIndex = Math.min(startIndex + pageSize! - 1, totalCount);

    const summary = (
      <>
        {!(pageNumber && pageSize) && totalCount ? `Showing ${totalCount} Records` : ''}
        {pageNumber && pageSize && totalCount
          ? `Showing ${startIndex} to ${endIndex} of ${totalCount} Records`
          : ''}
      </>
    );
    return summary;
  };

  return (
    <div className={classes.summary}>
      <span className={classes.summaryText}>
        {getPaginationSummary(pageNumber!, pageSize!, totalCount)}
      </span>
      {selectionCount > 0 && (
        <span className={classes.summaryText}>{` | ${selectionCount} item${
          selectionCount > 1 ? 's' : ''
        } selected`}</span>
      )}
    </div>
  );
};
