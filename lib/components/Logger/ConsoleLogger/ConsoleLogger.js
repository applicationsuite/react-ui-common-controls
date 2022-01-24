export const ConsoleLogger = {
    initialize: (options) => ({}),
    logMessage: (loggerInstance, message, options) => {
        console.log(message, options || '');
    },
    logEvent: (loggerInstance, message, options) => {
        console.log(message, options || '');
    },
    logError: (loggerInstance, message, options) => {
        console.error(message, options || '');
    }
};
