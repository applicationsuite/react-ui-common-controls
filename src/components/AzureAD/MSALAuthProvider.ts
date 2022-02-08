import { IAzureAuthProviderConfig, SELECT_ACCOUNT, IAuthInfo } from './AzureAD.models';
import {
  PublicClientApplication,
  Configuration,
  AuthenticationResult,
  AccountInfo,
  BrowserCacheLocation
} from '@azure/msal-browser';

export class MSALAuthProvider {
  config: IAzureAuthProviderConfig;
  clientApplication: PublicClientApplication;
  authInfo?: IAuthInfo;

  constructor(authProviderConfig: IAzureAuthProviderConfig) {
    this.config = authProviderConfig;
    const clientConfig: Configuration = {
      auth: {
        clientId: authProviderConfig.clientId,
        authority: authProviderConfig.authority ? authProviderConfig.authority : undefined,
        redirectUri: authProviderConfig.redirectUri
          ? authProviderConfig.redirectUri
          : window.location.origin,
        navigateToLoginRequestUrl: true
      },
      cache: {
        cacheLocation: authProviderConfig.persistLoginPastSession
          ? BrowserCacheLocation.LocalStorage
          : BrowserCacheLocation.SessionStorage,
        storeAuthStateInCookie: authProviderConfig.storeAuthStateInCookie
          ? authProviderConfig.storeAuthStateInCookie
          : true
      },
      system: {}
    };
    this.clientApplication = new PublicClientApplication(clientConfig);
  }

  initialize = async () => {
    let authResult = await this.clientApplication.handleRedirectPromise();
    if (authResult) {
      this.setUserInfo(authResult);
      this.authInfo && this.acquireToken(this.authInfo.user);
    }
  };

  login = async () => {
    if (!this.authInfo) {
      await this.clientApplication.loginRedirect({
        scopes: this.config.scopes,
        prompt: SELECT_ACCOUNT
      });
    }
  };

  logout = () => {
    if (!this.authInfo) {
      return;
    }
    const account = this.clientApplication.getAccountByUsername(this.authInfo!.user!.username);
    this.clientApplication.logoutRedirect({ account: account });
  };

  acquireToken = (account: AccountInfo | null) => {
    let _this = this;
    if (account) {
      _this.clientApplication
        .acquireTokenSilent({
          scopes: _this.config.scopes,
          account: account
        })
        .then((authResult: AuthenticationResult) => {
          if (authResult != null) {
            this.setUserInfo(authResult);
            _this.clientApplication.setActiveAccount(authResult.account);
            return authResult.idToken;
          }
        })
        .catch((tokenSilentError: any) => {
          _this.clientApplication.acquireTokenRedirect({
            scopes: _this.config.scopes,
            prompt: SELECT_ACCOUNT
          });
        });
    }
  };

  setUserInfo = (authResult: AuthenticationResult) => {
    this.authInfo = {
      jwtAccessToken: authResult.accessToken,
      jwtIdToken: authResult.idToken,
      user: authResult.account
    };
  };

  getAccount = () => {
    let allAccounts = this.clientApplication.getAllAccounts();
    let activeAccount = this.clientApplication.getActiveAccount()
      ? this.clientApplication.getActiveAccount()
      : allAccounts.length > 0
      ? allAccounts[0]
      : null;
    return activeAccount;
  };

  public getUserInfo = () => {
    return this.authInfo;
  };
}
