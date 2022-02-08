import { useEffect, useReducer } from 'react';
import { azureADReducer } from './AzureAD.reducers';
import { AZURE_AD_ACTIONS } from './AzureAD.actions';
import { MSALAuthProvider } from './MSALAuthProvider';
export const useInit = (props) => {
    var _a;
    const [state, dispatch] = useReducer(azureADReducer, {});
    const actions = azureADActions(dispatch, state);
    useEffect(() => {
        actions.initialize(props);
    }, [props]);
    useEffect(() => {
        var _a;
        ((_a = state.msalInstance) === null || _a === void 0 ? void 0 : _a.authInfo) && actions.updateData({ authInfo: state.msalInstance.authInfo });
    }, [(_a = state === null || state === void 0 ? void 0 : state.msalInstance) === null || _a === void 0 ? void 0 : _a.authInfo]);
    return { state: state, actions };
};
const azureADActions = (dispatch, state) => {
    const actions = {
        initialize: (props) => {
            const msalInstance = new MSALAuthProvider(props);
            !props.disableAutoInitialize && msalInstance.initialize();
            let initialData = Object.assign(Object.assign({}, props), { msalInstance: msalInstance });
            dispatch({ type: AZURE_AD_ACTIONS.INITIALIZE, data: props });
            return initialData;
        },
        updateData: (data) => {
            dispatch({ type: AZURE_AD_ACTIONS.UPDATE, data: data });
        },
        login: () => {
            state.msalInstance.login();
        },
        logOut: () => {
            state.msalInstance.logout();
        }
    };
    return actions;
};
