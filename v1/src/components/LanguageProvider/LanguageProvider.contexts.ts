import React from 'react';
import { ILanguageContextData } from './LanguageProvider.models';

export const LanguageContext = React.createContext<ILanguageContextData>(
  {} as ILanguageContextData
);
