import { MICRO_FRONTEND_ACTIONS } from './MicroFrontEnd.actions';
export const microFrontEndReducer = (state, action) => {
    switch (action.type) {
        case MICRO_FRONTEND_ACTIONS.INITIALIZE: {
            const initialData = action.data;
            return Object.assign(Object.assign({}, state), initialData);
        }
        case MICRO_FRONTEND_ACTIONS.UPDATE: {
            return Object.assign(Object.assign({}, state), action.data);
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
