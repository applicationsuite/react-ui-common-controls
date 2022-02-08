import { IAzureADProps } from './AzureAD.models';
export declare const AZURE_AD_ACTIONS: {
    INITIALIZE: string;
    UPDATE: string;
    LOGIN: string;
    LOG_OUT: string;
};
export interface IAzureADActions {
    initialize: (props: IAzureADProps) => any;
    updateData: (data: any) => void;
    login: () => void;
    logOut: () => void;
}
