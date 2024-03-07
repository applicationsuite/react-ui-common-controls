import React from 'react';
import { createUseStyles } from 'react-jss';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { IGridFilter, FilterOperation, FilterDataType } from '../GridView.models';
import { GridFilterLabel } from './GridFilterLabel';
import { rangeFilterStyles } from './RangeFilter.styles';

const useStyles = createUseStyles(rangeFilterStyles);

type CombinedProps = IGridFilter & {
  onFilterChange?: (filter: IGridFilter) => void;
};

export const RangeFilter: React.FC<CombinedProps> = (props: CombinedProps) => {
  const classes = useStyles();

  const [operationType, setOperationType] = React.useState(FilterOperation.Equal);

  const stackTokens: IStackTokens = { childrenGap: 12, padding: '0 0 0 6px' };

  React.useEffect(() => {
    setOperationType(props.operation || FilterOperation.Equal);
  }, []);

  const getRangeFilterOperations = (filterDataType: FilterDataType) => {
    let options: IDropdownOption[] = [
      { key: FilterOperation.Equal, text: 'Equal to (=)' },
      {
        key: FilterOperation.GreaterThanEqual,
        text: 'Grater than equal To (>=)'
      },
      {
        key: FilterOperation.LessThanEqual,
        text: 'Less than equal to (<=)'
      },
      { key: FilterOperation.Between, text: 'Between' }
    ];

    if (filterDataType === FilterDataType.String) {
      options = options.filter((option) => option.key === FilterOperation.Equal);
    }
    return options;
  };

  const onFilterDataChange = (
    values: any[],
    fieldDataType: FilterDataType = FilterDataType.String,
    operation?: FilterOperation
  ) => {
    const filter: IGridFilter = { ...props };
    filter.operation = operation! > -1 ? operation : operationType;
    filter.dataType = fieldDataType;
    filter.values = [...values];

    if (filter.values!.length) {
      if (filter.values!.length > 1) {
        filter.values = filter.values[0] || filter.values[1] ? filter.values : [];
        if (filter.operation !== FilterOperation.Between) {
          filter.values = [filter.values[0]];
        }
      } else {
        filter.values = filter.values[0] ? filter.values : [];
      }
    }
    props.onFilterChange && props.onFilterChange(filter);
  };

  const getSingleFilter = (fieldType: FilterDataType) => {
    const values = props.values ? (props.values.length ? props.values : ['']) : [''];
    const mapper = {
      [FilterDataType.String]: () => (
        <TextField
          placeholder="Value"
          value={values[0]}
          onChange={(e: any, value?: string) => {
            onFilterDataChange([value], fieldType);
          }}
        />
      ),
      [FilterDataType.Number]: () => (
        <TextField
          type="number"
          placeholder="Value"
          value={values[0]}
          onChange={(e: any, value?: string) => {
            onFilterDataChange([+value!], fieldType);
          }}
        />
      ),
      [FilterDataType.Date]: () => {
        values[0] = values[0] ? new Date(values[0]) : values[0];
        return (
          <DatePicker
            value={values[0]}
            onSelectDate={(date: any) => {
              onFilterDataChange([date], fieldType);
            }}
          />
        );
      },
      [FilterDataType.Boolean]: () => <></>
    };
    return mapper[fieldType]();
  };

  const getRangeFilter = (fieldType: FilterDataType) => {
    const values = props.values ? (props.values.length ? props.values : ['', '']) : ['', ''];
    const mapper = {
      [FilterDataType.String]: () => (
        <Stack horizontal>
          <Stack.Item grow>
            <TextField
              placeholder="Starting Value"
              value={values[0]}
              onChange={(e: any, value?: string) => {
                onFilterDataChange([value, values[1]], fieldType);
              }}
            />
          </Stack.Item>
          <span className={classes.toText}>to</span>
          <Stack.Item grow>
            <TextField
              placeholder="Ending Value"
              value={values[1]}
              onChange={(e: any, value?: string) => {
                onFilterDataChange([values[0], value], fieldType);
              }}
            />
          </Stack.Item>
        </Stack>
      ),
      [FilterDataType.Number]: () => (
        <Stack horizontal>
          <Stack.Item grow>
            <TextField
              placeholder="Starting Value"
              value={values[0]}
              onChange={(e: any, value?: string) => {
                onFilterDataChange([value, values[1]], fieldType);
              }}
            />
          </Stack.Item>
          <span className={classes.toText}>to</span>
          <Stack.Item grow>
            <TextField
              placeholder="Ending Value"
              value={values[1]}
              onChange={(e: any, value?: string) => {
                onFilterDataChange([values[0], value], fieldType);
              }}
            />
          </Stack.Item>
        </Stack>
      ),
      [FilterDataType.Date]: () => {
        values[0] = values[0] ? new Date(values[0]) : values[0];
        if (values!.length > 1) {
          values[1] = values[1] ? new Date(values[1]) : values[1];
        }
        return (
          <Stack horizontal>
            <Stack.Item grow>
              <DatePicker
                value={values[0]}
                onSelectDate={(date: any) => {
                  onFilterDataChange([date, values[1]], fieldType);
                }}
              />
            </Stack.Item>
            <span className={classes.toText}>to</span>
            <Stack.Item grow>
              <DatePicker
                value={values[1]}
                onSelectDate={(date: any) => {
                  onFilterDataChange([values[0], date], fieldType);
                }}
              />
            </Stack.Item>
          </Stack>
        );
      },
      [FilterDataType.Boolean]: () => <></>
    };
    return mapper[fieldType]();
  };

  const getFieldsByOperationAndFieldType = (
    filterOperationType: FilterOperation,
    fieldType: FilterDataType
  ) => {
    const mapper = {
      [FilterOperation.Equal]: getSingleFilter,
      [FilterOperation.GreaterThanEqual]: getSingleFilter,
      [FilterOperation.LessThanEqual]: getSingleFilter,
      [FilterOperation.Between]: getRangeFilter
    };
    return mapper[filterOperationType](fieldType);
  };

  const onRangeFilterTypeChange = (selected: IDropdownOption) => {
    selected && setOperationType(+selected.key);
    if (selected && props.values) {
      onFilterDataChange(props.values, props.dataType, +selected.key);
    }
  };

  return (
    <div className="grid-filter">
      <GridFilterLabel filterName={props.label} isFilterCollapsible={props.isCollapsible}>
        <Stack tokens={stackTokens}>
          <Dropdown
            options={getRangeFilterOperations(props.dataType || FilterDataType.String)}
            selectedKey={operationType}
            onChange={(e: any, selected: any) => {
              onRangeFilterTypeChange(selected!);
            }}
          />
          {getFieldsByOperationAndFieldType(operationType, props.dataType || FilterDataType.String)}
        </Stack>
      </GridFilterLabel>
    </div>
  );
};
