import { AccountInfo } from '@azure/msal-browser';
import { MSALAuthProvider } from './MSALAuthProvider';
export const SELECT_ACCOUNT = 'select_account';
export interface IAzureAuthProviderConfig {
  clientId: string;
  authority: string;
  redirectUri: string;
  persistLoginPastSession: boolean;
  cacheLocation: string;
  storeAuthStateInCookie: boolean;
  scopes: string[];
  onAuthInfoUpdate: (authInfo: IAuthInfo) => void;
}

export interface IAzureADProps extends IAzureAuthProviderConfig {
  disableAutoLogin: boolean;
  LoginErrorComponent: any;
}

export interface IAzureADData extends IAzureADProps {
  msalInstance: MSALAuthProvider;
  authInfo?: IAuthInfo;
}

export interface IAzureADContext {
  authInfo?: IAuthInfo;
  login: () => void;
  logOut: () => void;
}

export interface IAuthInfo {
  jwtAccessToken: string;
  jwtIdToken: string;
  user: AccountInfo | null;
}
