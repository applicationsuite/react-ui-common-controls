import { jsx as _jsx } from "react/jsx-runtime";
import { useInit } from './AzureAD.hooks';
import { AzureADContext } from './AzureAD.context';
export const AzureAD = (props) => {
    const { state, actions } = useInit(props);
    const contextValue = Object.assign(Object.assign({}, state), { login: actions.login, logOut: actions.logOut });
    return _jsx(AzureADContext.Provider, Object.assign({ value: contextValue }, { children: props.children }), void 0);
};
