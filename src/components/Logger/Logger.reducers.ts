import { LOGGER_ACTIONS } from './Logger.actions';
import { ILoggerData } from './Logger.models';

export const loggerReducer = (state: any, action: any) => {
  switch (action.type) {
    case LOGGER_ACTIONS.INITIALIZE: {
      const initialData: ILoggerData = action.data;
      return { ...state, ...initialData };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
