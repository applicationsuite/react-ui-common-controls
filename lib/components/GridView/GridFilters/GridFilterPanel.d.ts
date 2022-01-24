import React from 'react';
import { IGridFilterProps } from '../GridView.models';
declare type CombinedProps = IGridFilterProps & {
    showFilters: boolean;
    toggleFilters: (showPanel: boolean) => void;
};
export declare const GridFilterPanel: React.FC<CombinedProps>;
export {};
