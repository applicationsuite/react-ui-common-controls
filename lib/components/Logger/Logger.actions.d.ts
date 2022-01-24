import { ILoggerProps } from './Logger.models';
export declare const LOGGER_ACTIONS: {
    INITIALIZE: string;
};
export interface ILoggerActions {
    initialize: (props: ILoggerProps) => any;
    logMessage: (message: string, options?: any) => void;
    logEvent: (message: string, options?: any) => void;
    logError: (message: string, options?: any) => void;
}
