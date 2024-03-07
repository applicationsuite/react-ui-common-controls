import { APP_WRAPPER_ACTIONS } from './AppWrapper.actions';
export const appWrapperReducer = (state, action) => {
    switch (action.type) {
        case APP_WRAPPER_ACTIONS.INITIALIZE: {
            const initialData = action.data;
            return Object.assign(Object.assign({}, state), initialData);
        }
        case APP_WRAPPER_ACTIONS.SET_APP_DATA: {
            const currentState = state;
            currentState.data = Object.assign(Object.assign({}, currentState.data), action.data);
            return Object.assign({}, currentState);
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
