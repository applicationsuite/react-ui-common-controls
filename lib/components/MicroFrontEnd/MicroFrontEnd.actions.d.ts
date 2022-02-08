import { IMicroFrontEndInfo, IMicroFrontEndProps } from './MicroFrontEnd.models';
export declare const MICRO_FRONTEND_ACTIONS: {
    INITIALIZE: string;
    UPDATE: string;
};
export interface IMicroFrontEndActions {
    initialize: (props: IMicroFrontEndProps) => IMicroFrontEndInfo;
    updateData: (data: any) => void;
}
