import { MICRO_FRONTEND_ACTIONS } from './MicroFrontEnd.actions';
import { IMicroFrontEndContext } from './MicroFrontEnd.models';

export const microFrontEndReducer = (state: any, action: any) => {
  switch (action.type) {
    case MICRO_FRONTEND_ACTIONS.INITIALIZE: {
      const initialData: IMicroFrontEndContext = action.data;
      return { ...state, ...initialData };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
