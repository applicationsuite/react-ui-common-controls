import { createIntl, useIntl, IntlShape } from 'react-intl';
import { LocalizationData, ILocalizationString } from './LanguageProvider.models';

export const useLocalization: any = (options?: any) => {
  const intl = useIntl();
  return intl;
};

export const getLocalizedString = (
  localizationInstance: any,
  localizationStringData: ILocalizationString
) =>
  localizationInstance.formatMessage && localizationInstance.formatMessage(localizationStringData);

export const useLocalizedString = (localizationStringData: ILocalizationString) => {
  const intl = useIntl();
  return intl.formatMessage(localizationStringData);
};

export const getIntl = (language?: string, localizationData?: any[]) => {
  const localizationStrings = mergeLocalizationData(localizationData || []);
  const localization = getLocalizationDetails(language, localizationStrings);
  return createIntl(localization);
};

export const getLocalizationDetails = (language?: string, localizationData?: any) => {
  const languageName =
    language || (navigator.languages && navigator.languages[0]) || navigator.language;
  const messages =
    localizationData && (localizationData[languageName] || localizationData['en-US']);
  // Split locales with a region code
  const locale = languageName && languageName.toLowerCase().split(/[_-]+/)[0];
  const localeData: LocalizationData = {
    locale,
    messages: messages || []
  };
  return localeData;
};

export const mergeLocalizationData = (localizationStrings: any[]) => {
  const localizationData: any = {};
  localizationStrings.forEach((localization) => {
    localization &&
      Object.keys(localization).forEach((language) => {
        localizationData[language] = { ...localizationData[language], ...localization[language] };
      });
  });
  return localizationData;
};
