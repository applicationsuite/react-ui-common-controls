import { createIntl, useIntl } from 'react-intl';
export const useLocalization = (options) => {
    try {
        const intl = useIntl();
        return intl;
    }
    catch (error) {
        return undefined;
    }
};
export const localizedString = (localizationStringData, localizationInstance) => {
    return localizationInstance
        ? localizationInstance.formatMessage(localizationStringData)
        : localizationStringData.defaultMessage;
};
export const getIntl = (language, localizationData) => {
    const localizationStrings = mergeLocalizationData(localizationData || []);
    const localization = getLocalizationDetails(language, localizationStrings);
    return createIntl(localization);
};
export const getLocalizationDetails = (language, localizationData) => {
    const languageName = language || (navigator.languages && navigator.languages[0]) || navigator.language;
    const messages = localizationData && (localizationData[languageName] || localizationData['en-US']);
    // Split locales with a region code
    const locale = languageName && languageName.toLowerCase().split(/[_-]+/)[0];
    const localeData = {
        locale,
        messages: messages || []
    };
    return localeData;
};
export const mergeLocalizationData = (localizationStrings) => {
    const localizationData = {};
    localizationStrings.forEach((localization) => {
        localization &&
            Object.keys(localization).forEach((language) => {
                localizationData[language] = Object.assign(Object.assign({}, localizationData[language]), localization[language]);
            });
    });
    return localizationData;
};
