import React from 'react';
import { IGlobalContext } from './AppWrapper.models';

export const AppDataContext = React.createContext<IGlobalContext | undefined>(undefined);
