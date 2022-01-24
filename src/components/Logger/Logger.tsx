import React from 'react';
import { ILoggerProps } from './Logger.models';
import { useInit } from './Logger.hooks';
import { LoggerContext } from './Logger.context';

export const Logger: React.FC<ILoggerProps> = (props) => {
  const { state, actions } = useInit(props);
  return <LoggerContext.Provider value={actions}>{props.children}</LoggerContext.Provider>;
};
