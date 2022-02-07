import React from 'react';
import { createUseStyles } from 'react-jss';
import {
  Dropdown,
  IDropdownOption,
  DatePicker,
  IStackTokens,
  Stack,
  TextField
} from '@fluentui/react';
import {
  IGridFilter,
  FilterDataType,
  FilterOperation,
  ITimeLineRange,
  TimelineFilterType,
  QUATER_START_MONTH,
  QUATER_START_YEAR,
  TIME_LINE_FILTER_TYPE_MAP
} from '../GridView.models';
import { MONTH_NAMES_SHORT } from 'react-ui-common-controls';
import { GridFilterLabel } from './GridFilterLabel';
import { rangeFilterStyles } from './RangeFilter.styles';

const useStyles = createUseStyles(rangeFilterStyles);

type CombinedProps = IGridFilter & {
  onFilterChange?: (filter: IGridFilter) => void;
};

export const TimeLineFilter: React.FC<CombinedProps> = (props: CombinedProps) => {
  const classes = useStyles();
  const stackTokens: IStackTokens = { childrenGap: 20, padding: '0 0 0 6px' };

  const [timeline, setTimeLine] = React.useState(-1);
  React.useEffect(() => {
    setTimeLine(props.data.selectedTimeLine);
  }, []);

  const getQuaterLabel = (quaterKey: string, year: number, month: number, lastQuaterDay: number) =>
    `${quaterKey} (${MONTH_NAMES_SHORT[month]} 1, ${year} - ${
      MONTH_NAMES_SHORT[month + 2]
    } ${lastQuaterDay}, ${year})`;
  const getTimeLineData = () => {
    let month = QUATER_START_MONTH;
    let year = QUATER_START_YEAR;
    const quaterList = Array<ITimeLineRange>();
    const quaters = [
      TimelineFilterType.Q1,
      TimelineFilterType.Q2,
      TimelineFilterType.Q3,
      TimelineFilterType.Q4
    ];
    quaters.forEach((item, index) => {
      const lastQuaterDay = new Date(year, month + 3, 0).getDate();
      const quater: ITimeLineRange = {
        timeLineKey: item,
        timeLineLabel: getQuaterLabel(TIME_LINE_FILTER_TYPE_MAP[item], year, month, lastQuaterDay),
        startDate: new Date(year, month, 1, 0, 0, 0, 0),
        endDate: new Date(year, month + 2, lastQuaterDay, 0, 0, 0, 0)
      };
      quaterList.push(quater);
      month += 3;
      if (month === 12 || month === 11) {
        month = 0;
        year += 1;
      }
    });
    return quaterList;
  };

  const getTimeLineFilterOptions = () => {
    const timeLineData = getTimeLineData();
    const options: IDropdownOption[] = [];
    options.push({ key: -1, text: 'Any Time' });
    timeLineData.forEach((item) => {
      options.push({
        key: item.timeLineKey,
        text: item.timeLineLabel,
        data: item
      });
    });
    options.push({
      key: TimelineFilterType.Custom,
      text: TIME_LINE_FILTER_TYPE_MAP[TimelineFilterType.Custom]
    });
    return options;
  };

  const onFilterDataChange = (values: any[], timlineType?: TimelineFilterType) => {
    const filter: IGridFilter = { ...props };
    filter.operation = FilterOperation.Between;
    filter.dataType = FilterDataType.Date;
    filter.data = filter.data || {};
    filter.data.selectedTimeLine = timlineType;
    filter.values = [...values];
    if (filter.values!.length) {
      if (filter.values!.length > 1) {
        filter.values = filter.values[0] || filter.values[1] ? filter.values : [];
      } else {
        filter.values = filter.values[0] ? filter.values : [];
      }
    }
    props.onFilterChange && props.onFilterChange(filter);
  };

  const getTimelineCustomFilter = (valueList?: any[]) => {
    const values = valueList
      ? valueList.length
        ? valueList
        : new Array<any>(2)
      : new Array<any>(2);
    values[0] = values[0] ? new Date(values[0]) : values[0];
    if (valueList!.length > 1) {
      values[1] = values[1] ? new Date(values[1]) : values[1];
    }
    return (
      <Stack horizontal>
        <Stack.Item grow>
          <DatePicker
            value={values[0]}
            onSelectDate={(date: any) => {
              onFilterDataChange([date, values![1]], TimelineFilterType.Custom);
            }}
          />
        </Stack.Item>
        <span className={classes.toText}>to</span>
        <Stack.Item grow>
          <DatePicker
            value={values[1]}
            onSelectDate={(date: any) => {
              onFilterDataChange([values![0], date], TimelineFilterType.Custom);
            }}
          />
        </Stack.Item>
      </Stack>
    );
  };

  const onTimeLineFilterOptionChange = (selected: IDropdownOption) => {
    const value = selected ? +selected.key : -1;
    setTimeLine(value);
    if (value === -1) {
      onFilterDataChange([], value);
    } else {
      selected &&
        selected.data &&
        onFilterDataChange([selected.data.startDate, selected.data.endDate], value);
    }
  };

  return (
    <div className="grid-filter">
      <GridFilterLabel filterName={props.label} isFilterCollapsible={props.isCollapsible}>
        <Stack tokens={stackTokens}>
          <Dropdown
            options={getTimeLineFilterOptions()}
            selectedKey={timeline}
            onChange={(e: any, selected: any) => {
              onTimeLineFilterOptionChange(selected!);
            }}
          />
          {timeline === TimelineFilterType.Custom && getTimelineCustomFilter(props.values)}
        </Stack>
      </GridFilterLabel>
    </div>
  );
};
