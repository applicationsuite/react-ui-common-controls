import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { LocalizationData, ILocalizationProviderProps, ILanguageContextData } from './LanguageProvider.models';
import { getLocalizationDetails, mergeLocalizationData } from './locallizationUtil';
import { LanguageContext } from './LanguageProvider.contexts';
import { AppDataContext } from '../';

export const LanguageProvider: React.FC<ILocalizationProviderProps> = (props) => {
  const browserLanguage =
    props.language || navigator.language || (navigator.languages && navigator.languages[0]);
  const [localization, setLocalization] = useState<LocalizationData>();
  const localizationStrings = mergeLocalizationData(props.localizationData || []);

  const appContext = React.useContext(AppDataContext);

  React.useEffect(() => {
    const localizationInfo = getLocalizationDetails(browserLanguage, localizationStrings);
    setLocalization(localizationInfo);
  }, [browserLanguage, props.language]);

  const setLanguage = (languageKey: string) => {
    const localizationInfo = getLocalizationDetails(languageKey, localizationStrings);
    if (appContext && appContext.actions.setLanguage) {
      appContext.actions.setLanguage(languageKey);
    } else {
      setLocalization(localizationInfo);
    }
  };

  const contextData: ILanguageContextData = {
    language: localization?.locale || '',
    setLanguage
  };

  if (!localization) {
    return null;
  }
  return (
    <LanguageContext.Provider value={contextData}>
      <IntlProvider locale={localization!.locale} messages={localization!.messages}>
        {props.children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};
