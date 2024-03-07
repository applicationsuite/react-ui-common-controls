import { useEffect, useReducer } from 'react';
import { loggerReducer } from './Logger.reducers';
import { LOGGER_ACTIONS, ILoggerActions } from './Logger.actions';
import { ILoggerProps, ILoggerData, LoggerType, ILoggerInfo } from './Logger.models';
import { AppInsightLogger } from './AppInsightLogger';
import { ConsoleLogger } from './ConsoleLogger';

export const useInit = (props: ILoggerProps) => {
  const [state, dispatch] = useReducer(loggerReducer, {});
  const actions = loggerActions(dispatch, state) as ILoggerActions;

  useEffect(() => {
    actions.initialize(props);
  }, [props]);
  return { state: state as ILoggerData, actions };
};

const loggerActions = (dispatch: any, state: ILoggerProps) => {
  const actions: ILoggerActions = {
    initialize: (props: ILoggerProps) => {
      const initialData: ILoggerData = {
        loggers: initializeLoggers(props.loggers!)
      };
      dispatch({ type: LOGGER_ACTIONS.INITIALIZE, data: initialData });
    },
    logMessage: (message: string, options?: any) => {
      state.loggers &&
        state.loggers.forEach((logger) => {
          const loggerInstance = loggerMapper[logger.type];
          loggerInstance && loggerInstance.logMessage(logger.instance, message, options);
        });
    },
    logEvent: (message: string, options?: any) => {
      state.loggers &&
        state.loggers.forEach((logger) => {
          const loggerInstance = loggerMapper[logger.type];
          loggerInstance && loggerInstance.logEvent(logger.instance, message, options);
        });
    },
    logError: (message: string, options?: any) => {
      state.loggers &&
        state.loggers.forEach((logger) => {
          const loggerInstance = loggerMapper[logger.type];
          loggerInstance && loggerInstance.logError(logger.instance, message, options);
        });
    }
  };
  return actions;
};

const loggerMapper = {
  [LoggerType.Console]: ConsoleLogger,
  [LoggerType.AppInsight]: AppInsightLogger
};

const initializeLoggers = (loggers: ILoggerInfo[]) => {
  const loggersData = loggers || [];
  loggersData.forEach((logger) => {
    const loggerInstance = loggerMapper[logger.type];
    logger.instance = loggerInstance && loggerInstance.initialize(logger.config);
  });
  if (!loggersData.length) {
    loggersData.push({
      type: LoggerType.Console
    });
  }
  return loggersData;
};
