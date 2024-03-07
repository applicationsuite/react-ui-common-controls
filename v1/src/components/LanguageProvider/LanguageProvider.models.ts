export interface LocalizationData {
  locale: string;
  messages: any;
}

export interface ILocalizationProviderProps {
  language?: string;
  localizationData?: any[];
}

export interface ILocalizationString {
  id: string;
  defaultMessage: string;
}

export interface ILanguageContextData {
  language: string;
  setLanguage: (language: string) => void;
}
