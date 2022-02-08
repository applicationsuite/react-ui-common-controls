import { IAzureAuthProviderConfig, IAuthInfo } from './AzureAD.models';
import { PublicClientApplication, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
export declare class MSALAuthProvider {
    config: IAzureAuthProviderConfig;
    clientApplication: PublicClientApplication;
    authInfo?: IAuthInfo;
    constructor(authProviderConfig: IAzureAuthProviderConfig);
    initialize: () => Promise<void>;
    login: () => Promise<void>;
    logout: () => void;
    acquireToken: (account: AccountInfo | null) => void;
    setUserInfo: (authResult: AuthenticationResult) => void;
    getAccount: () => AccountInfo | null;
    getUserInfo: () => IAuthInfo | undefined;
}
