import { ILoggerProps } from '../Logger';
import { IAppWrapperActions } from './AppWrapper.actions';

export enum ThemeType {
  Light = 'light',
  Dark = 'dark'
}

export interface IAppWrapperProps {
  userInfo?: IUserInfo;
  language?: string;
  localizationData?: any[];
  loggerInfo?: ILoggerProps;
  theme?: any;
  data?: any;
}

export interface IAppWrapperData extends IAppWrapperProps {}

export interface IUserInfo {
  name?: string;
  email?: string;
}

export interface IGlobalContext {
  state: IAppWrapperData;
  actions: IAppWrapperActions;
}
