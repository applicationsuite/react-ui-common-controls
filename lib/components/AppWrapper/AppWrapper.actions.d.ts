import { IUserInfo, IAppWrapperProps } from './AppWrapper.models';
export declare const APP_WRAPPER_ACTIONS: {
    INITIALIZE: string;
    SET_APP_DATA: string;
};
export interface IAppWrapperActions {
    initialize: (props: IAppWrapperProps) => void;
    setLanguage: (language: string) => void;
    setTheme: (theme: any) => void;
    setUserInfo: (userInfo?: IUserInfo) => void;
    setAppData: (data?: any) => void;
}
