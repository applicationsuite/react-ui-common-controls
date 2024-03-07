import { APP_WRAPPER_ACTIONS } from './AppWrapper.actions';
import { IAppWrapperData } from './AppWrapper.models';

export const appWrapperReducer = (state: any, action: any) => {
  switch (action.type) {
    case APP_WRAPPER_ACTIONS.INITIALIZE: {
      const initialData: IAppWrapperData = action.data;
      return { ...state, ...initialData };
    }
    case APP_WRAPPER_ACTIONS.SET_APP_DATA: {
      const currentState: IAppWrapperData = state;
      currentState.data = { ...currentState.data, ...action.data };
      return { ...currentState };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
