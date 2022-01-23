import * as React from 'react';
import { IGridColumn, IGridViewParams } from './GridView.models';

export const GridViewDefault = (props: IGridViewParams) => {
  const getColumns = (columns: IGridColumn[]) =>
    props.hideColumnPicker
      ? props.columns
      : columns && columns.filter((column) => column.selected === true);
  return <></>;
};
