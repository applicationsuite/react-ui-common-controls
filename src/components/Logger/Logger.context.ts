import React from 'react';
import { ILoggerActions } from './Logger.actions';

export const LoggerContext = React.createContext<ILoggerActions | undefined>(undefined);
