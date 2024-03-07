import { IntlShape } from 'react-intl';
import { LocalizationData, ILocalizationString } from './LanguageProvider.models';
export declare const useLocalization: any;
export declare const localizedString: (localizationStringData: ILocalizationString, localizationInstance?: any) => any;
export declare const getIntl: (language?: string | undefined, localizationData?: any[] | undefined) => IntlShape;
export declare const getLocalizationDetails: (language?: string | undefined, localizationData?: any) => LocalizationData;
export declare const mergeLocalizationData: (localizationStrings: any[]) => any;
