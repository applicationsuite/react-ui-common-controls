import { createUseStyles } from 'react-jss';
import * as React from 'react';
import { Link, Callout, PrimaryButton, DefaultButton, Icon } from '@fluentui/react';
import { cloneDeep } from 'lodash';
import { filterTagStyles } from './FilterTag.styles';
import {
  IFilterTagProps,
  IGridFilter,
  FilterOperation,
  FilterDataType,
  FilterType,
  OPERATIONS_STRINGS_MAP,
  OPERATIONS_DATE_STRINGS_MAP
} from '../GridView.models';
import { getFormattedValue } from '../GridViewUtils';
import { GridFilters } from '../GridFilters';

const useStyles = createUseStyles(filterTagStyles);

export const FilterTags: React.FC<IFilterTagProps> = (props: IFilterTagProps) => {
  const classes = useStyles();

  if (!(props.filters && props.filters.length > 0)) {
    return null;
  }
  return (
    <div className={classes.filterContainer}>
      <span className={classes.filterText}>
        <Icon iconName="Filter" className="filter-css" />
        <span className={classes.filterCss}>Filters:</span>
      </span>

      {props.filters &&
        props.filters.map((filter) => (
          <FilterTag
            key={filter.id}
            {...filter}
            maxFilterTagLength={props.maxFilterTagLength}
            onRemoveFilter={props.onRemoveFilter}
            onApplyFilter={props.onApplyFilter!}
            onChangeFilter={props.onChangeFilter}
          />
        ))}
      {props.onClearFilters && (
        <DefaultButton
          className={classes.borderlessButton}
          ariaLabel="Clear Filters"
          iconProps={{ iconName: 'ClearFilter' }}
          text="Clear Filters"
          onClick={props.onClearFilters}
        />
      )}
    </div>
  );
};

type CombinedProps = IGridFilter & {
  maxFilterTagLength?: number;
  onRemoveFilter?: (key: string) => void;
  onChangeFilter?: (filter: IGridFilter) => void;
  onApplyFilter?: (filter: IGridFilter) => void;
};

export const FilterTag: React.FC<CombinedProps> = (filter: CombinedProps) => {
  const classes = useStyles();

  const [filterDialog, toggleFilterDialog] = React.useState(false);
  const filterButton = React.useRef(null);
  const [filterData, setFilterData] = React.useState<IGridFilter>();

  const rangeValues = {
    filterValueStart: filter.values!.length ? filter.values![0] : undefined,
    filterValueEnd:
      filter.values!.length && filter.values!.length > 1 ? filter.values![1] : undefined
  };

  const onToggleFilterDialog = () => {
    if (filter.onApplyFilter) {
      setFilterData(cloneDeep(filter));
    }
    toggleFilterDialog(true);
  };

  const renderFilterValues = (gridFilter: IGridFilter) => {
    if (gridFilter.operation !== FilterOperation.Between) {
      let formattedValues: any = [];
      if (
        filter.filterType === FilterType.SelectionFilter ||
        filter.filterType === FilterType.ToggleFilter
      ) {
        if (filter.items?.length === filter.values?.length) {
          formattedValues.push('All');
        } else {
          const filterItems = gridFilter.items?.filter((item) =>
            gridFilter.values!.includes(item.value)
          );
          const maxValueLength = filter.maxFilterTagLength || filterItems?.length;
          formattedValues = filterItems
            ? filterItems.slice(0, maxValueLength).map((item) => getFormattedValue(item.label))
            : [];
          const remainingItems = filterItems?.length! - formattedValues.length;
          if (remainingItems > 0) {
            formattedValues.push(`...+${remainingItems}`);
          }
        }
      } else {
        formattedValues = gridFilter.values?.map((item) => getFormattedValue(item));
      }
      // gridFilter.values = gridFilter.values || [];

      return (
        <>
          <span className={classes.filterTagVal}>
            {OPERATIONS_STRINGS_MAP[gridFilter.operation!]
              ? gridFilter.dataType === FilterDataType.Date
                ? OPERATIONS_DATE_STRINGS_MAP[gridFilter.operation!]
                : OPERATIONS_STRINGS_MAP[gridFilter.operation!]
              : ''}
          </span>
          <span className={classes.filterTagVal}>{formattedValues!.join(', ')}</span>
        </>
      );
    }
    const formattedStartValue = getFormattedValue(rangeValues.filterValueStart);
    const formattedEndValue = getFormattedValue(rangeValues.filterValueEnd);

    return (
      <>
        <>
          <span className={classes.filterTagVal}>
            {rangeValues.filterValueStart && rangeValues.filterValueEnd
              ? ''
              : rangeValues.filterValueStart
              ? gridFilter.dataType === FilterDataType.Date
                ? OPERATIONS_DATE_STRINGS_MAP[FilterOperation.GreaterThanEqual]
                : OPERATIONS_STRINGS_MAP[FilterOperation.GreaterThanEqual]
              : rangeValues.filterValueEnd
              ? gridFilter.dataType === FilterDataType.Date
                ? OPERATIONS_DATE_STRINGS_MAP[FilterOperation.LessThanEqual]
                : OPERATIONS_STRINGS_MAP[FilterOperation.LessThanEqual]
              : ''}
          </span>
        </>
        <span className={classes.filterTagVal}>{formattedStartValue || ''}</span>
        {formattedStartValue && formattedEndValue && (
          <span className={classes.filterTagVal}> to </span>
        )}
        <span className={classes.filterTagVal}>{formattedEndValue || ''}</span>
      </>
    );
  };

  const onChangeFilter = (gridFilter: IGridFilter) => {
    if (filter.onApplyFilter) {
      setFilterData(gridFilter);
    } else {
      filter.onChangeFilter && filter.onChangeFilter(gridFilter);
    }
  };

  const onApplyFilter = () => {
    filter.onApplyFilter && filter.onApplyFilter(filterData!);
    toggleFilterDialog(false);
    setFilterData(undefined);
  };

  const onCancel = () => {
    toggleFilterDialog(false);
    setFilterData(undefined);
  };

  const filterInfo = filter.onApplyFilter ? filterData : filter;
  const filters = filterInfo ? [{ ...filterInfo, isCollapsible: false }] : [];
  return (
    <>
      <div className={classes.filterTags}>
        <div ref={filterButton}>
          <Link
            className={classes.filterDetails}
            onClick={() => {
              onToggleFilterDialog();
            }}
          >
            <span>{filter.label}:</span>
            {renderFilterValues(filter)}
          </Link>
        </div>
        {!filter.isNonRemovable && (
          <button
            className={classes.filterTagsClose}
            id={filter.id}
            type="button"
            onClick={() => {
              filter.onRemoveFilter && filter.onRemoveFilter(filter.id);
            }}
          >
            <Icon iconName="Clear" />
          </button>
        )}
      </div>
      {filterDialog && filter && (
        <Callout
          className={classes.filterDialog}
          role="dialog"
          target={filterButton.current}
          gapSpace={0}
          setInitialFocus
          onDismiss={() => {
            toggleFilterDialog(!filterDialog);
          }}
        >
          <GridFilters filters={filters} onFilterChange={onChangeFilter} />
          {filter.onApplyFilter && (
            <div>
              <PrimaryButton onClick={onApplyFilter} className={classes.applyBtn}>
                Apply
              </PrimaryButton>
              <DefaultButton text={'Cancel'} onClick={onCancel} />
            </div>
          )}
        </Callout>
      )}
    </>
  );
};
