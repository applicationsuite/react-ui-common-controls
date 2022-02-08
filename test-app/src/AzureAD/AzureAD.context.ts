import React from 'react';
import { IAzureADContext } from './AzureAD.models';

export const AzureADContext = React.createContext<IAzureADContext | undefined>(undefined);
