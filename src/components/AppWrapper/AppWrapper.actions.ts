import { IUserInfo, IAppWrapperProps } from './AppWrapper.models';

export const APP_WRAPPER_ACTIONS = {
  INITIALIZE: 'initialize',
  SET_APP_DATA: 'setAppData'
};

export interface IAppWrapperActions {
  initialize: (props: IAppWrapperProps) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: any) => void;
  setUserInfo: (userInfo?: IUserInfo) => void;
  setAppData: (data?: any) => void;
}
