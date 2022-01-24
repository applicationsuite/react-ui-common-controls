import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { getLocalizationDetails, mergeLocalizationData } from './locallizationUtil';
import { LanguageContext } from './LanguageProvider.contexts';
import { AppDataContext } from '../';
export const LanguageProvider = ({ children, language, localizationData }) => {
    const browserLanguage = language || navigator.language || (navigator.languages && navigator.languages[0]);
    const [localization, setLocalization] = useState();
    const localizationStrings = mergeLocalizationData(localizationData || []);
    const appContext = React.useContext(AppDataContext);
    React.useEffect(() => {
        const localizationInfo = getLocalizationDetails(browserLanguage, localizationStrings);
        setLocalization(localizationInfo);
    }, [browserLanguage, language]);
    const setLanguage = (languageKey) => {
        const localizationInfo = getLocalizationDetails(languageKey, localizationStrings);
        if (appContext && appContext.actions.setLanguage) {
            appContext.actions.setLanguage(languageKey);
        }
        else {
            setLocalization(localizationInfo);
        }
    };
    const contextData = {
        language: (localization === null || localization === void 0 ? void 0 : localization.locale) || '',
        setLanguage
    };
    if (!localization) {
        return null;
    }
    return (_jsx(LanguageContext.Provider, Object.assign({ value: contextData }, { children: _jsx(IntlProvider, Object.assign({ locale: localization.locale, messages: localization.messages }, { children: children }), void 0) }), void 0));
};
