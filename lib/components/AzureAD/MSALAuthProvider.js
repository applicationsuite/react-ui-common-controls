var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SELECT_ACCOUNT } from './AzureAD.models';
import { PublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
export class MSALAuthProvider {
    constructor(authProviderConfig) {
        this.initialize = () => __awaiter(this, void 0, void 0, function* () {
            let authResult = yield this.clientApplication.handleRedirectPromise();
            if (authResult) {
                this.setUserInfo(authResult);
                this.authInfo && this.acquireToken(this.authInfo.user);
            }
        });
        this.login = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.authInfo) {
                yield this.clientApplication.loginRedirect({
                    scopes: this.config.scopes,
                    prompt: SELECT_ACCOUNT
                });
            }
        });
        this.logout = () => {
            if (!this.authInfo) {
                return;
            }
            const account = this.clientApplication.getAccountByUsername(this.authInfo.user.username);
            this.clientApplication.logoutRedirect({ account: account });
        };
        this.acquireToken = (account) => {
            let _this = this;
            if (account) {
                _this.clientApplication
                    .acquireTokenSilent({
                    scopes: _this.config.scopes,
                    account: account
                })
                    .then((authResult) => {
                    if (authResult != null) {
                        this.setUserInfo(authResult);
                        _this.clientApplication.setActiveAccount(authResult.account);
                        return authResult.idToken;
                    }
                })
                    .catch((tokenSilentError) => {
                    _this.clientApplication.acquireTokenRedirect({
                        scopes: _this.config.scopes,
                        prompt: SELECT_ACCOUNT
                    });
                });
            }
        };
        this.setUserInfo = (authResult) => {
            this.authInfo = {
                jwtAccessToken: authResult.accessToken,
                jwtIdToken: authResult.idToken,
                user: authResult.account
            };
        };
        this.getAccount = () => {
            let allAccounts = this.clientApplication.getAllAccounts();
            let activeAccount = this.clientApplication.getActiveAccount()
                ? this.clientApplication.getActiveAccount()
                : allAccounts.length > 0
                    ? allAccounts[0]
                    : null;
            return activeAccount;
        };
        this.getUserInfo = () => {
            return this.authInfo;
        };
        this.config = authProviderConfig;
        const clientConfig = {
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
}
