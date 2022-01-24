import { WIZARD_ACTIONS } from './Wizard.actions';
export const wizardReducer = (state, action) => {
    switch (action.type) {
        case WIZARD_ACTIONS.INITIALIZE: {
            const initialData = action.data;
            return Object.assign(Object.assign({}, state), initialData);
        }
        case WIZARD_ACTIONS.SET_CURRENT_STEP: {
            return Object.assign(Object.assign({}, state), { selectedStep: action.data });
        }
        case WIZARD_ACTIONS.SET_LAST_STEP: {
            return Object.assign(Object.assign({}, state), { lastSelectedStep: action.data });
        }
        case WIZARD_ACTIONS.UPDATE_STEPS: {
            return Object.assign(Object.assign({}, state), { steps: action.data });
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};
