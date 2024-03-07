import { ILoggerActions } from './Logger.actions';
import { ILoggerProps, ILoggerData } from './Logger.models';
export declare const useInit: (props: ILoggerProps) => {
    state: ILoggerData;
    actions: ILoggerActions;
};
