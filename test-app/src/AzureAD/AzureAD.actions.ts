import { IAzureADProps } from './AzureAD.models';

export const AZURE_AD_ACTIONS = {
  INITIALIZE: 'initialize',
  UPDATE: 'update',
  LOGIN: 'login',
  LOG_OUT: 'logOut'
};

export interface IAzureADActions {
  initialize: (props: IAzureADProps) => any;
  updateData: (data: any) => void;
  login: () => void;
  logOut: () => void;
}
