import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, Checkbox } from '@fluentui/react';
import { mergeClassNames } from 'react-ui-common-controls';
import { IGridColumn, IGridViewParams } from './GridView.models';
import { createUseStyles } from 'react-jss';
import { gridViewStyles } from './GridView.styles';

const useStyles = createUseStyles(gridViewStyles);

export const GridViewDefault = (props: IGridViewParams) => {
  const classes = useStyles();

  const detailListClassName = mergeClassNames([classes.listStyles, props.detailsListClass || '']);
  const groupedDetailListClassName = mergeClassNames([
    classes.listStyles,
    classes.groupedListStyles,
    props.detailsListClass || ''
  ]);

  const getColumns = (columns: IGridColumn[]) => {
    let filteredColumns = props.hideColumnPicker
      ? columns
      : columns && columns.filter((column) => column.selected === true);
    return filteredColumns;
  };

  const onRenderCheckbox = (checkboxProps: any) => (
    <div className={classes.checkBoxEvent}>
      <Checkbox checked={checkboxProps.checked} />
    </div>
  );

  const groupProps = props.groupProps || {};
  groupProps.headerProps = groupProps.headerProps || {};
  groupProps.headerProps.onRenderGroupHeaderCheckbox =
    groupProps.headerProps.onRenderGroupHeaderCheckbox || onRenderCheckbox;

  return (
    <DetailsList
      {...props}
      onRenderCheckbox={onRenderCheckbox}
      groupProps={groupProps}
      columns={getColumns(props.columns)}
      className={props.groups ? groupedDetailListClassName : detailListClassName}
      selectionMode={
        props.allowSelection
          ? props.selectionMode
            ? props.selectionMode
            : SelectionMode.multiple
          : SelectionMode.none
      }
      selectionPreservedOnEmptyClick={props.selectionPreservedOnEmptyClick || true}
      layoutMode={DetailsListLayoutMode.justified}
      isHeaderVisible={props.isHeaderVisible ? props.isHeaderVisible : true}
    />
  );
};
