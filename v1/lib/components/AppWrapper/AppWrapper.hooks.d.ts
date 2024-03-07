import { IAppWrapperActions } from './AppWrapper.actions';
import { IAppWrapperProps, IAppWrapperData } from './AppWrapper.models';
export declare const useInit: (props: IAppWrapperProps) => {
    state: IAppWrapperData;
    actions: IAppWrapperActions;
};
