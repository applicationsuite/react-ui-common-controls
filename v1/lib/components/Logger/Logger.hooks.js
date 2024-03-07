import { useEffect, useReducer } from 'react';
import { loggerReducer } from './Logger.reducers';
import { LOGGER_ACTIONS } from './Logger.actions';
import { LoggerType } from './Logger.models';
import { AppInsightLogger } from './AppInsightLogger';
import { ConsoleLogger } from './ConsoleLogger';
export const useInit = (props) => {
    const [state, dispatch] = useReducer(loggerReducer, {});
    const actions = loggerActions(dispatch, state);
    useEffect(() => {
        actions.initialize(props);
    }, [props]);
    return { state: state, actions };
};
const loggerActions = (dispatch, state) => {
    const actions = {
        initialize: (props) => {
            const initialData = {
                loggers: initializeLoggers(props.loggers)
            };
            dispatch({ type: LOGGER_ACTIONS.INITIALIZE, data: initialData });
        },
        logMessage: (message, options) => {
            state.loggers &&
                state.loggers.forEach((logger) => {
                    const loggerInstance = loggerMapper[logger.type];
                    loggerInstance && loggerInstance.logMessage(logger.instance, message, options);
                });
        },
        logEvent: (message, options) => {
            state.loggers &&
                state.loggers.forEach((logger) => {
                    const loggerInstance = loggerMapper[logger.type];
                    loggerInstance && loggerInstance.logEvent(logger.instance, message, options);
                });
        },
        logError: (message, options) => {
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
const initializeLoggers = (loggers) => {
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
