import { IMicroFrontEndActions } from './MicroFrontEnd.actions';
import { IMicroFrontEndProps, IMicroFrontEndInfo } from './MicroFrontEnd.models';
export declare const useInit: (props: IMicroFrontEndProps, onLoadComplete: (error: string) => void) => {
    state: IMicroFrontEndInfo;
    actions: IMicroFrontEndActions;
};
