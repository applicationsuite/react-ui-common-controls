import { MICRO_FRONTEND_ACTIONS } from './MicroFrontEnd.actions';
export const microFrontEndReducer = (state, action) => {
    switch (action.type) {
        case MICRO_FRONTEND_ACTIONS.INITIALIZE: {
            const initialData = action.data;
            return Object.assign(Object.assign({}, state), initialData);
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
