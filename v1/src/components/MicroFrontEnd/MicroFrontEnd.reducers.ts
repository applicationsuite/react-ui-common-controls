import { MICRO_FRONTEND_ACTIONS } from './MicroFrontEnd.actions';
import { IMicroFrontEndInfo } from './MicroFrontEnd.models';

export const microFrontEndReducer = (state: any, action: any) => {
  switch (action.type) {
    case MICRO_FRONTEND_ACTIONS.INITIALIZE: {
      const initialData: IMicroFrontEndInfo = action.data;
      return { ...state, ...initialData };
    }
    case MICRO_FRONTEND_ACTIONS.UPDATE: {
      return { ...state, ...action.data };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
