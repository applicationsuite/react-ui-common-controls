import React from 'react';
import { createUseStyles } from 'react-jss';
import { IGridFilterProps, FilterType, IGridFilter } from '../GridView.models';
import { SelectionFilter } from './SelectionFilter';
import { RangeFilter } from './RangeFilter';
import { ToggleFilter } from './ToggleFilter';
import { TimeLineFilter } from './TimelineFilter';
import { gridFilterStyles } from './GridFilters.styles';

const useStyles = createUseStyles(gridFilterStyles);
export const GridFilters: React.FC<IGridFilterProps> = (props: IGridFilterProps) => {
  const { filters, onFilterChange } = props;

  const classes = useStyles();
  const renderSearchFilter = (filter: IGridFilter) => {
    const mapper = {
      [FilterType.SelectionFilter]: () => (
        <SelectionFilter key={filter.id} {...filter} onFilterChange={onFilterChange} />
      ),
      [FilterType.RangeFilter]: () => (
        <RangeFilter key={filter.id} {...filter} onFilterChange={onFilterChange} />
      ),
      [FilterType.ToggleFilter]: () => (
        <ToggleFilter key={filter.id} {...filter} onFilterChange={onFilterChange} />
      ),
      [FilterType.TimeLineFilter]: () => (
        <TimeLineFilter key={filter.id} {...filter} onFilterChange={onFilterChange} />
      ),
      [FilterType.Custom]: () => {
        const CustomFilter = filter.FilterComponent;
        return CustomFilter ? (
          <CustomFilter key={filter.id} {...filter} onFilterChange={onFilterChange} />
        ) : null;
      }
    };
    return mapper[filter.filterType]();
  };
  const getSectionSeparater = (filter: IGridFilter, gridFilters: IGridFilter[], index: number) => {
    if (
      (filter.filterType === FilterType.SelectionFilter ||
        filter.filterType === FilterType.ToggleFilter) &&
      !filter.items?.length
    ) {
      return null;
    }
    if (gridFilters.length - 1 !== index) {
      return <hr />;
    }
    return null;
  };
  return (
    <div className={classes.filterMain}>
      {filters &&
        filters.map((filter, index) => (
          <React.Fragment key={index}>
            {renderSearchFilter(filter)}
            {getSectionSeparater(filter, filters, index)}
          </React.Fragment>
        ))}
    </div>
  );
};
