import React from 'react';
import { IGridViewContextData } from './GridView.models';

export const GridViewContext = React.createContext<IGridViewContextData | undefined>(undefined);
