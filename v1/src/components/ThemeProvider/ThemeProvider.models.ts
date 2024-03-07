export interface IThemeProviderProps {
  theme?: any;
  loadTheme?: (theme: any) => void;
}

export interface IThemeProviderData extends IThemeProviderProps {}

export interface IThemeContextData {
  theme?: any;
  setTheme?: (theme: any, themeData?: any) => void;
}
