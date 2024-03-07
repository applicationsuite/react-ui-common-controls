import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { ThemeContext } from './ThemeProvider.context';
import { AppDataContext } from '../';
export const ThemeProvider = (props) => {
    const appContext = React.useContext(AppDataContext);
    let selectedTheme = props.theme;
    React.useEffect(() => {
        props.loadTheme && props.loadTheme(props.theme);
    }, [props.theme]);
    const setTheme = (theme) => {
        if (appContext && appContext.actions.setTheme) {
            appContext.actions.setTheme(theme);
        }
        selectedTheme = theme;
    };
    const themeContextData = {
        theme: selectedTheme,
        setTheme: setTheme
    };
    return _jsx(ThemeContext.Provider, Object.assign({ value: themeContextData }, { children: props.children }), void 0);
};
