import React from 'react';
import { IThemeContextData, IThemeProviderProps } from './ThemeProvider.models';
import { ThemeContext } from './ThemeProvider.context';
import { AppDataContext } from '../';

export const ThemeProvider: React.FC<IThemeProviderProps> = (props) => {  
  const appContext = React.useContext(AppDataContext);
  let selectedTheme = props.theme;

  const setTheme = (theme: any) =>{
    if (appContext && appContext.actions.setTheme) {
      appContext.actions.setTheme(theme);
    } 
    selectedTheme = theme;
  }
  const themeContextData: IThemeContextData = {
    theme: selectedTheme,
    setTheme: setTheme
  };
  return <ThemeContext.Provider value={themeContextData}>{props.children}</ThemeContext.Provider>;
};
