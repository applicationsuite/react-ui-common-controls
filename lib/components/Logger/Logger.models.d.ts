export declare enum LoggerType {
    Console = 0,
    AppInsight = 1
}
export interface ILoggerInfo {
    type: LoggerType;
    config?: any;
    instance?: any;
}
export interface ILoggerProps {
    loggers?: ILoggerInfo[];
}
export interface ILoggerData {
    loggers?: ILoggerInfo[];
}
export interface ILogger {
    initialize: (props: ILoggerProps) => any;
    logMessage: (loggerInstance: any, message: string, options?: any) => void;
    logEvent: (loggerInstance: any, message: string, options?: any) => void;
    logError: (loggerInstance: any, message: string, options?: any) => void;
}
