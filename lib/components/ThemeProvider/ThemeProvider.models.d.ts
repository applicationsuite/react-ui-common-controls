export interface IThemeProviderProps {
    theme?: any;
}
export interface IThemeProviderData extends IThemeProviderProps {
}
export interface IThemeContextData {
    theme?: any;
    setTheme?: (theme: any, themeData?: any) => void;
}
