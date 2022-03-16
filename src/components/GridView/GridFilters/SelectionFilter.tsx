import React from 'react';
import { createUseStyles } from 'react-jss';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { TextField } from '@fluentui/react/lib/TextField';
import { IGridFilter, IGridFilterItem } from '../GridView.models';
import { FILTER_ITEM_TEXT_FIELD } from '../GridView.models';
import { GridFilterLabel } from './GridFilterLabel';
import { selectionFilterStyles } from './SelectionFilter.styles';
import { applyFilterTextByField } from '../GridViewUtils';

type CombinedProps = IGridFilter & { onFilterChange?: (filter: IGridFilter) => void };

const useStyles = createUseStyles(selectionFilterStyles);

export const SelectionFilter: React.FC<CombinedProps> = (props: CombinedProps) => {
  const classes = useStyles();
  const [filterText, setFilterText] = React.useState<string>('');
  const [filterItems, setFilterItems] = React.useState<IGridFilterItem[]>([]);

  React.useEffect(() => {
    setFilterItems(getItems(props.items) || []);
  }, [props.items]);

  const onFilterItemChange = (filterItem: IGridFilterItem, isSelected: boolean) => {
    const items = props.items || [];
    items.forEach((item) => {
      item.selected =
        item.value === filterItem.value ? isSelected : props.values?.includes(item.value);
    });
    const filter = { ...props };
    filter.values = items.filter((item) => item.selected === true).map((item) => item.value);
    props.onFilterChange && props.onFilterChange(filter);
  };

  const onFilterTextChange = (searchText?: string) => {
    const items = applyFilterTextByField(searchText, props.items, FILTER_ITEM_TEXT_FIELD);
    setFilterText(searchText!);
    setFilterItems(items);
  };

  const getItems = (items: IGridFilterItem[] = []) => {
    const values = props.values?.filter((value) => !items.find((item) => item.value === value));
    values?.forEach((value) => {
      items.push({
        value,
        label: value,
        selected: true
      });
    });
    return items;
  };

  const onSelectAll = (checked: boolean) => {
    const items = filterItems || [];
    items.forEach((item) => {
      item.selected = checked;
    });
    const filter = { ...props };
    filter.items = filter.items || [];
    filter.values = checked ? filter.items.map((item) => item.value) : [];
    props.onFilterChange && props.onFilterChange(filter);
  };

  if (!props.items) return null;

  if (props.items && props.items.length === 0) {
    return null;
  }

  return (
    <GridFilterLabel filterName={props.label} isFilterCollapsible={props.isCollapsible}>
      {props.itemsSearchRequired && (
        <div className={classes.filterTextBox}>
          <TextField
            placeholder="Filter"
            value={filterText}
            onChange={(e: any, value?: string) => {
              onFilterTextChange(value);
            }}
          />
        </div>
      )}
      <div className={classes.accordianBody}>
        {!props.hideSelectAll && filterItems && filterItems.length > 0 && (
          <Checkbox
            ariaLabel="Select All"
            label="Select All"
            className={classes.selectAllCheckBox}
            checked={props.values?.length === props.items?.length}
            onChange={(e: any, checked: any) => {
              onSelectAll(checked!);
            }}
          />
        )}
        {filterItems.map((item, index) => (
          <div key={index}>
            <div className={classes.selectionFilters}>
              <Checkbox
                ariaLabel={`${item.label} ${item.count ? item.count : ''}`}
                label={`${item.label} ${item.count ? `(${item.count})` : ''}`}
                disabled={item.count === 0}
                checked={props.values?.includes(item.value)}
                onRenderLabel={item.onRenderLabel}
                onChange={(e: any, checked: any) => {
                  onFilterItemChange(item, checked!);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GridFilterLabel>
  );
};
