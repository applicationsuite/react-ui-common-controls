import { useEffect, useReducer } from 'react';
import { appWrapperReducer } from './AppWrapper.reducers';
import { APP_WRAPPER_ACTIONS, IAppWrapperActions } from './AppWrapper.actions';
import { IAppWrapperProps, IAppWrapperData, IUserInfo } from './AppWrapper.models';

export const useInit = (props: IAppWrapperProps) => {
  const [state, dispatch] = useReducer(appWrapperReducer, {});
  const actions = appWrapperActions(dispatch, state) as IAppWrapperActions;

  useEffect(() => {
    actions.initialize(props);
  }, [props]);
  return { state: state as IAppWrapperData, actions };
};

const appWrapperActions = (dispatch: any, state: IAppWrapperData) => {
  const actions: IAppWrapperActions = {
    initialize: (props: IAppWrapperProps) => {
      const initialData: IAppWrapperData = {
        loggerInfo: props.loggerInfo,
        language: props.language,
        localizationData: props.localizationData,
        userInfo: props.userInfo,
        theme: props.theme,
        data: props.data
      };
      dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: initialData });
    },
    setTheme: (theme: any) => {
      const stateToUpdate = state;
      state.theme = theme;
      dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: stateToUpdate });
    },
    setLanguage: (language: string) => {
      const stateToUpdate = state;
      state.language = language;
      dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: stateToUpdate });
    },
    setUserInfo: (userInfo?: IUserInfo) => {
      const stateToUpdate = state;
      state.userInfo = userInfo;
      dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: stateToUpdate });
    },
    setAppData: (data?: any) => {
      dispatch({ type: APP_WRAPPER_ACTIONS.SET_APP_DATA, data });
    }
  };
  return actions;
};
