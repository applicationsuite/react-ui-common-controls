import React from 'react';
import { IAzureADProps, IAzureADContext } from './AzureAD.models';
import { useInit } from './AzureAD.hooks';
import { AzureADContext } from './AzureAD.context';

export const AzureAD: React.FC<IAzureADProps> = (props) => {
  const { LoginErrorComponent } = props;
  const { state, actions } = useInit(props);

  if (!props.disableAutoLogin && !state.authInfo) {
    return LoginErrorComponent ? (
      <LoginErrorComponent error={state.msalInstance.error}></LoginErrorComponent>
    ) : null;
  }
  const contextValue: IAzureADContext = {
    authInfo: state.authInfo,
    login: actions.login,
    logOut: actions.logOut
  };
  return <AzureADContext.Provider value={contextValue}>{props.children}</AzureADContext.Provider>;
};
