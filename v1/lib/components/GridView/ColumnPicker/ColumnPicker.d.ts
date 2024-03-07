import * as React from 'react';
import { IGridColumn } from '../GridView.models';
export interface ColumnPickerParams {
    columns: IGridColumn[];
    onColumnChange(columns: IGridColumn[]): void;
}
export declare const ColumnPicker: React.FC<ColumnPickerParams>;
