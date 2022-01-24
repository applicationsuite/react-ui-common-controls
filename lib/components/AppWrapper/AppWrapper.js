import { jsx as _jsx } from "react/jsx-runtime";
import { useInit } from './AppWrapper.hooks';
import { LanguageProvider, ErrorBoundary, ThemeProvider } from '..';
import { Logger } from '../Logger';
import { AppDataContext } from './AppWrapper.context';
export const AppWrapper = (props) => {
    const { state, actions } = useInit(props);
    return (_jsx(Logger, Object.assign({}, props.loggerInfo, { children: _jsx(ErrorBoundary, { children: _jsx(AppDataContext.Provider, Object.assign({ value: { state, actions } }, { children: _jsx(ThemeProvider, Object.assign({ theme: state.theme }, { children: _jsx(LanguageProvider, Object.assign({ language: state.language, localizationData: props.localizationData }, { children: props.children }), void 0) }), void 0) }), void 0) }, void 0) }), void 0));
};
