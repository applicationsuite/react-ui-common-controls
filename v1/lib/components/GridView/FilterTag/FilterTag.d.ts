import * as React from 'react';
import { IFilterTagProps, IGridFilter } from '../GridView.models';
export declare const FilterTags: React.FC<IFilterTagProps>;
declare type CombinedProps = IGridFilter & {
    maxFilterTagLength?: number;
    onRemoveFilter?: (key: string) => void;
    onChangeFilter?: (filter: IGridFilter) => void;
    onApplyFilter?: (filter: IGridFilter) => void;
};
export declare const FilterTag: React.FC<CombinedProps>;
export {};
