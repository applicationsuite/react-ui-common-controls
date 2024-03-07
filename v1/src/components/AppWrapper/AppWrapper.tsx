import React from 'react';
import { IAppWrapperProps, IGlobalContext } from './AppWrapper.models';
import { useInit } from './AppWrapper.hooks';
import { LanguageProvider } from '../LanguageProvider';
import { ErrorBoundary } from '../ErrorBoundary';
import { ThemeProvider } from '../ThemeProvider';
import { Logger } from '../Logger';
import { AppDataContext } from './AppWrapper.context';

export const AppWrapper: React.FC<IAppWrapperProps> = (props) => {
  const { state, actions } = useInit(props);
  return (
    <Logger {...props.loggerInfo}>
      <ErrorBoundary>
        <AppDataContext.Provider value={{ state, actions }}>
          <ThemeProvider theme={state.theme}>
            <LanguageProvider language={state.language} localizationData={props.localizationData}>
              {props.children}
            </LanguageProvider>
          </ThemeProvider>
        </AppDataContext.Provider>
      </ErrorBoundary>
    </Logger>
  );
};
