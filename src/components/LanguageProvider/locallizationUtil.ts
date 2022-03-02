import { createIntl, useIntl, IntlShape } from 'react-intl';
import { LocalizationData, ILocalizationString } from './LanguageProvider.models';

export const useLocalization: any = (options?: any) => {
  try {
    const intl = useIntl();
    return intl;
  } catch (error) {
    return undefined;
  }
};

export const localizedString = (
  localizationStringData: ILocalizationString,
  localizationInstance?: any
) => {
  return localizationInstance
    ? localizationInstance.formatMessage(localizationStringData)
    : localizationStringData.defaultMessage;
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
