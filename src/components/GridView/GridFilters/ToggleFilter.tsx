import React from 'react';
import { IChoiceGroupOption, ChoiceGroup } from '@fluentui/react/lib/ChoiceGroup';
import { TextField } from '@fluentui/react/lib/TextField';
import { createUseStyles } from 'react-jss';
import { IGridFilter, IGridFilterItem, FILTER_ITEM_TEXT_FIELD } from '../GridView.models';
import { GridFilterLabel } from './GridFilterLabel';
import { selectionFilterStyles } from './SelectionFilter.styles';
import { applyFilterTextByField } from '../GridViewUtils';

type CombinedProps = IGridFilter & {
  onFilterChange?: (filter: IGridFilter) => void;
};

const useStyles = createUseStyles(selectionFilterStyles);

export const ToggleFilter: React.FC<CombinedProps> = (props: CombinedProps) => {
  const [filterText, setFilterText] = React.useState<string>('');
  const [filterItems, setFilterItems] = React.useState<IGridFilterItem[]>([]);
  const [itemsChoiceGroup, setItemsChoiceGroup] = React.useState<IChoiceGroupOption[]>([]);

  React.useEffect(() => {
    setFilterItems(getItems(props.items) || []);
    setItemsChoiceGroup(getChoiceGroups(props.items));
  }, [props.items]);

  const classes = useStyles();

  const onFilterItemChange = (selectedOption: IChoiceGroupOption) => {
    const filter = { ...props };
    let items = filter.items || [];
    items = items.map((item) => ({ ...item }));
    items.forEach((item) => {
      item.selected = item.value === selectedOption.key;
    });
    filter.items = items;
    filter.values = items.filter((item) => item.selected === true).map((item) => item.value);
    props.onFilterChange && props.onFilterChange(filter);
  };

  const onFilterTextChange = (searchText?: string) => {
    const items = applyFilterTextByField(searchText, props.items, FILTER_ITEM_TEXT_FIELD);
    setFilterText(searchText!);
    setFilterItems(items);
    setItemsChoiceGroup(getChoiceGroups(items));
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

  const getChoiceGroups = (items: IGridFilterItem[] = []) => {
    const options: IChoiceGroupOption[] = items.map((item) => ({
      key: item.value,
      text:
        item.label || (item.label.toString && item.label.toString() === 'false')
          ? item.label.toString()
          : item.label
    }));
    return options;
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
        {itemsChoiceGroup.length > 0 && (
          <ChoiceGroup
            defaultSelectedKey={props.values![0]}
            options={itemsChoiceGroup}
            onChange={(e, option) => {
              onFilterItemChange(option!);
            }}
          />
        )}
      </div>
    </GridFilterLabel>
  );
};
