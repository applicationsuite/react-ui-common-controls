import { AZURE_AD_ACTIONS } from './AzureAD.actions';
import { IAzureADData } from './AzureAD.models';

export const azureADReducer = (state: any, action: any) => {
  switch (action.type) {
    case AZURE_AD_ACTIONS.INITIALIZE: {
      const initialData: IAzureADData = action.data;
      return { ...state, ...initialData };
    }
    case AZURE_AD_ACTIONS.UPDATE: {
      return { ...state, ...action.data };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};
