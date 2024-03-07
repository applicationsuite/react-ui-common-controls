import { ILogger } from '../Logger.models';

export const ConsoleLogger: ILogger = {
  initialize: (options: any) => ({}),
  logMessage: (loggerInstance: any, message: string, options?: any) => {
    console.log(message, options || '');
  },
  logEvent: (loggerInstance: any, message: string, options?: any) => {
    console.log(message, options || '');
  },
  logError: (loggerInstance: any, message: string, options?: any) => {
    console.error(message, options || '');
  }
};
