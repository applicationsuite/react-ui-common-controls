import { useEffect, useReducer } from 'react';
import { azureADReducer } from './AzureAD.reducers';
import { AZURE_AD_ACTIONS, IAzureADActions } from './AzureAD.actions';
import { IAzureADProps, IAzureADData } from './AzureAD.models';
import { MSALAuthProvider } from './MSALAuthProvider';

export const useInit = (props: IAzureADProps) => {
  const [state, dispatch] = useReducer(azureADReducer, {});
  const actions = azureADActions(dispatch, state) as IAzureADActions;
  useEffect(() => {
    actions.initialize(props);
  }, [props]);

  useEffect(() => {
    state.msalInstance?.authInfo && actions.updateData({ authInfo: state.msalInstance.authInfo });
  }, [state?.msalInstance?.authInfo]);

  return { state: state as IAzureADData, actions };
};

const azureADActions = (dispatch: any, state: IAzureADData) => {
  const actions: IAzureADActions = {
    initialize: (props: IAzureADProps) => {
      const msalInstance = new MSALAuthProvider(props);
      !props.disableAutoInitialize && msalInstance.initialize();
      let initialData: IAzureADData = { ...props, msalInstance: msalInstance };
      dispatch({ type: AZURE_AD_ACTIONS.INITIALIZE, data: props });
      return initialData;
    },
    updateData: (data: any) => {
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
