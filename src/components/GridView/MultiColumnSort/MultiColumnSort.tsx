import React from 'react';
import { createUseStyles } from 'react-jss';
import { IMultiColumnSort, ISortingOptions } from '../GridView.models';
import { multiColumnSortStyles } from './MultiColumnSort.styles';
import { IDropdownOption, Dropdown } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Stack } from '@fluentui/react/lib/Stack';

const useStyles = createUseStyles(multiColumnSortStyles);

export const MultiColumnSort: React.FC<IMultiColumnSort> = (props) => {
  const classes = useStyles();

  const [sortingOptions, setSortingOptions] = React.useState([] as ISortingOptions[]);

  React.useEffect(() => {
    setSortingOptions(props.sortingOptions || []);
  }, [props.sortingOptions]);

  const sortLevel = props.sortLevel || 1;
  const columns = props.columns.filter((col) => col.disableSort !== true);

  const getSortColumns = (index: number) => {
    let sortOption = sortingOptions && sortingOptions[index];
    let filteredSortOptions = sortingOptions;
    filteredSortOptions = sortOption
      ? sortingOptions.filter((item) => item.sortColumn !== sortOption.sortColumn)
      : filteredSortOptions;
    const options: IDropdownOption[] = [];
    columns.forEach((item) => {
      if (!filteredSortOptions.find((i) => i.sortColumn === item.key)) {
        options.push({
          key: item.key,
          text: item.name,
          data: item
        });
      }
    });
    return options;
  };

  const getColumnOrder = () => {
    const options: IDropdownOption[] = [];
    options.push({
      key: 'asc',
      text: 'Ascending'
    });
    options.push({
      key: 'desc',
      text: 'Descending'
    });
    return options;
  };

  const onSortColumnChange = (item: any, index: number) => {
    let sortOption = sortingOptions && sortingOptions[index];
    if (sortOption) {
      sortOption.sortColumn = item.key;
      sortOption.sortField = item.data.fieldName;
      sortOption.sortType = sortOption.sortType || 'asc';
    } else {
      sortOption = {
        sortColumn: item.key,
        sortField: item.data.fieldName,
        sortType: 'asc'
      };
      sortingOptions.push(sortOption);
    }
    setSortingOptions([...sortingOptions]);
    props.isInMemorySorting && props.onSort && props.onSort(sortingOptions);
  };

  const onSortOrderChange = (item: any, index: number) => {
    let sortOption = sortingOptions && sortingOptions[index];
    if (!sortOption) {
      return;
    }
    sortOption.sortType = item.key;
    setSortingOptions([...sortingOptions]);
    props.isInMemorySorting && props.onSort && props.onSort(sortingOptions);
  };

  const onApplySorting = () => {
    props.toggleSortButton && props.toggleSortButton();
    props.onSort && props.onSort(sortingOptions);
  };

  const onCancel = () => {
    props.toggleSortButton && props.toggleSortButton();
  };

  const onClearSorting = () => {
    props.toggleSortButton && props.toggleSortButton();
    props.onSort && props.onSort([]);
  };

  const getColumnsToSort = () => {
    return [...Array(sortLevel)].map((item, index) => {
      const sortOption = sortingOptions && sortingOptions[index];
      return (
        <Stack horizontal key={index}>
          <Stack.Item grow className={classes.columnSection}>
            <Dropdown
              className={classes.columnField}
              selectedKey={sortOption ? sortOption.sortColumn : -1}
              ariaLabel="Column"
              options={getSortColumns(index)}
              onChange={(e: any, selected: any) => {
                onSortColumnChange(selected!, index);
              }}
            />
          </Stack.Item>
          <Stack.Item grow className={classes.orderSection}>
            <Dropdown
              disabled={sortOption ? false : true}
              className={classes.orderField}
              selectedKey={sortOption ? sortOption.sortType : -1}
              ariaLabel="Order"
              options={getColumnOrder()}
              onChange={(e: any, selected: any) => {
                onSortOrderChange(selected!, index);
              }}
            />
          </Stack.Item>
        </Stack>
      );
    });
  };

  return (
    <div className={classes.columnsSortContainer}>
      <Stack horizontal>
        <Stack.Item grow className={classes.columnSectionHeader}>
          Column
        </Stack.Item>
        <Stack.Item grow className={classes.orderSectionHeader}>
          Order
        </Stack.Item>
      </Stack>
      {getColumnsToSort()}

      <Stack horizontal>
        <Stack.Item grow className={classes.footerLeftBtns}>
          <DefaultButton
            className={classes.resetButton}
            ariaLabel="Reset"
            iconProps={{ iconName: 'RevToggleKey' }}
            text="Reset"
            onClick={onClearSorting}
          />
        </Stack.Item>
        <Stack.Item grow className={classes.footerRightBtns}>
          {!props.isInMemorySorting && (
            <div>
              <PrimaryButton onClick={onApplySorting}>Apply</PrimaryButton>
              <DefaultButton text={'Cancel'} onClick={onCancel} className={classes.cancelButton} />
            </div>
          )}
        </Stack.Item>
      </Stack>
    </div>
  );
};
