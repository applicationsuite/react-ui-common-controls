import React from 'react';
import { IAzureADProps, IAzureADContext } from './AzureAD.models';
import { useInit } from './AzureAD.hooks';
import { AzureADContext } from './AzureAD.context';

export const AzureAD: React.FC<IAzureADProps> = (props) => {
  const { state, actions } = useInit(props);
  const contextValue: IAzureADContext = { ...state, login: actions.login, logOut: actions.logOut };
  return <AzureADContext.Provider value={contextValue}>{props.children}</AzureADContext.Provider>;
};
