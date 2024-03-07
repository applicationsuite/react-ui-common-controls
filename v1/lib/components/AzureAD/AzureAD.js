import { jsx as _jsx } from "react/jsx-runtime";
import { useInit } from './AzureAD.hooks';
import { AzureADContext } from './AzureAD.context';
export const AzureAD = (props) => {
    const { LoginErrorComponent } = props;
    const { state, actions } = useInit(props);
    if (!props.disableAutoLogin && !state.authInfo) {
        return LoginErrorComponent ? (_jsx(LoginErrorComponent, { error: state.msalInstance.error }, void 0)) : null;
    }
    const contextValue = {
        authInfo: state.authInfo,
        login: actions.login,
        logOut: actions.logOut
    };
    return _jsx(AzureADContext.Provider, Object.assign({ value: contextValue }, { children: props.children }), void 0);
};
