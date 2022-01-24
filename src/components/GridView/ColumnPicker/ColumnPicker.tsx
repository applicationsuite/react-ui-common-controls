import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { FocusZone, Checkbox } from '@fluentui/react';
import { IGridColumn } from '../GridView.models';
import { columnPickerStyles } from './ColumnPicker.styles';

const useStyles = createUseStyles(columnPickerStyles);
export interface ColumnPickerParams {
  columns: IGridColumn[];
  onColumnChange(columns: IGridColumn[]): void;
}

export const ColumnPicker: React.FC<ColumnPickerParams> = (props) => {
  const classes = useStyles();
  const { columns, onColumnChange } = props;

  const handleChange = (e: any, column: IGridColumn) => {
    if (isLastColumn() && column.selected) {
      return;
    }
    const cols = columns;
    const selectedColumn = cols.find((col) => col.key === column.key);
    if (selectedColumn) {
      selectedColumn.selected = !selectedColumn.selected;
    }
    onColumnChange([...cols]);
  };

  const isLastColumn = () => columns.filter((item) => item.selected).length === 1;

  const onSelectAllChange: any = (e: any, checked: boolean) => {
    const cols = columns;
    cols.forEach((column) => {
      if (!column.required) column.selected = checked;
    });
    onColumnChange([...cols]);
  };

  const onFocus = (disableSelctAll: boolean) => {};

  const selectAllCheckUncheck = () =>
    columns.length === columns.filter((item) => item.selected).length;
  const selectAllCheckForIsAnyRequired = () => columns.filter((item) => item.required).length > 0;

  const renderColumn: any = (column: IGridColumn, index: number) => (
    <div key={column.name} className={classes.columnNameText}>
      <Checkbox
        ariaLabel={column.name}
        label={column.name}
        checked={column.selected}
        disabled={column.required || (column.selected && isLastColumn())}
        onChange={(e) => handleChange(e, column)}
      />
    </div>
  );
  const selctAll = selectAllCheckUncheck();
  const disabledAllChk = selectAllCheckForIsAnyRequired();
  return (
    <FocusZone isCircularNavigation>
      <div className={classes.columnPickerList}>
        <div className={classes.selectAllOption}>
          <Checkbox
            ariaLabel="Select All"
            onChange={onSelectAllChange}
            checked={selctAll}
            disabled={disabledAllChk ? false : selctAll}
            label="Select All"
          />
        </div>
        {columns && columns.map((column, index) => renderColumn(column, index))}
        <div onFocus={() => onFocus(selctAll)} />
      </div>
    </FocusZone>
  );
};
