import { WIZARD_ACTIONS } from './Wizard.actions';
import { IWizardData } from './Wizard.models';

export const wizardReducer = (state: any, action: any) => {
  switch (action.type) {
    case WIZARD_ACTIONS.INITIALIZE: {
      const initialData: IWizardData = action.data;
      return { ...state, ...initialData };
    }
    case WIZARD_ACTIONS.SET_CURRENT_STEP: {
      return { ...state, selectedStep: action.data };
    }
    case WIZARD_ACTIONS.SET_LAST_STEP: {
      return { ...state, lastSelectedStep: action.data };
    }
    case WIZARD_ACTIONS.UPDATE_STEPS: {
      return { ...state, steps: action.data };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
