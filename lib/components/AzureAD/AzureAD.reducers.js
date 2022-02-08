import { AZURE_AD_ACTIONS } from './AzureAD.actions';
export const azureADReducer = (state, action) => {
    switch (action.type) {
        case AZURE_AD_ACTIONS.INITIALIZE: {
            const initialData = action.data;
            return Object.assign(Object.assign({}, state), initialData);
        }
        case AZURE_AD_ACTIONS.UPDATE: {
            return Object.assign(Object.assign({}, state), action.data);
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
