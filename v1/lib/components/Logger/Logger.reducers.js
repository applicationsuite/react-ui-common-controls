import { LOGGER_ACTIONS } from './Logger.actions';
export const loggerReducer = (state, action) => {
    switch (action.type) {
        case LOGGER_ACTIONS.INITIALIZE: {
            const initialData = action.data;
            return Object.assign(Object.assign({}, state), initialData);
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
