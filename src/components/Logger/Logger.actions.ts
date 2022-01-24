import { ILoggerProps } from './Logger.models';

export const LOGGER_ACTIONS = {
  INITIALIZE: 'initialize'
};

export interface ILoggerActions {
  initialize: (props: ILoggerProps) => any;
  logMessage: (message: string, options?: any) => void;
  logEvent: (message: string, options?: any) => void;
  logError: (message: string, options?: any) => void;
}
