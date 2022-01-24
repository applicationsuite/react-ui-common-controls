import React from 'react';
import { IGridFilter } from '../GridView.models';
declare type CombinedProps = IGridFilter & {
    onFilterChange?: (filter: IGridFilter) => void;
};
export declare const TimeLineFilter: React.FC<CombinedProps>;
export {};
