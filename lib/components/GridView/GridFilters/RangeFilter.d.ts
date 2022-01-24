import React from 'react';
import { IGridFilter } from '../GridView.models';
declare type CombinedProps = IGridFilter & {
    onFilterChange?: (filter: IGridFilter) => void;
};
export declare const RangeFilter: React.FC<CombinedProps>;
export {};
