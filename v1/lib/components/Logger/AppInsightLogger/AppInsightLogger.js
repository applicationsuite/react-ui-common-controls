import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
export const AppInsightLogger = {
    initialize: (options) => {
        const config = options;
        const reactPlugin = new ReactPlugin();
        const ai = new ApplicationInsights({
            config: {
                instrumentationKey: config === null || config === void 0 ? void 0 : config.instrumentationKey,
                extensions: [reactPlugin],
                enableAutoRouteTracking: true,
                enableRequestHeaderTracking: true,
                enableResponseHeaderTracking: true,
                extensionConfig: {
                    [reactPlugin.identifier]: { history: window.history }
                }
            }
        });
        ai.loadAppInsights();
        ai.setAuthenticatedUserContext(config.userEmail);
        return ai.appInsights;
    },
    logMessage: (loggerInstance, message, options) => {
        const appInsights = loggerInstance;
        appInsights &&
            appInsights.trackTrace({
                message,
                severityLevel: SeverityLevel.Information
            });
    },
    logEvent: (loggerInstance, message, options) => {
        const appInsights = loggerInstance;
        appInsights &&
            appInsights.trackEvent({
                name: message
            });
    },
    logError: (loggerInstance, message, options) => {
        const appInsights = loggerInstance;
        appInsights &&
            appInsights.trackException({
                exception: new Error(message),
                severityLevel: SeverityLevel.Critical
            });
    }
};
