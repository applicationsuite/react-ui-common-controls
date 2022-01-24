export interface LocalizationData {
  locale: string;
  messages: any;
}

export interface ILanguageContextData {
  language: string;
  setLanguage: (language: string) => void;
}

export interface ILocalizationString {
  id: string;
  defaultMessage: string;
}
