import { AccountInfo } from '@azure/msal-browser';
import { MSALAuthProvider } from './MSALAuthProvider';
export declare const SELECT_ACCOUNT = "select_account";
export interface IAzureAuthProviderConfig {
    clientId: string;
    authority: string;
    redirectUri: string;
    persistLoginPastSession: boolean;
    cacheLocation: string;
    storeAuthStateInCookie: boolean;
    scopes: string[];
}
export interface IAzureADProps extends IAzureAuthProviderConfig {
    disableAutoInitialize: boolean;
}
export interface IAzureADData extends IAzureADProps {
    msalInstance: MSALAuthProvider;
    authInfo?: IAuthInfo;
}
export interface IAzureADContext extends IAzureADData {
    login: () => void;
    logOut: () => void;
}
export interface IAuthInfo {
    jwtAccessToken: string;
    jwtIdToken: string;
    user: AccountInfo | null;
}
