import {
  ApplicationInsights,
  SeverityLevel,
  IEventTelemetry
} from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ILogger } from '../Logger.models';
import { IAppInsightConfig } from './AppInsightLogger.models';

export const AppInsightLogger: ILogger = {
  initialize: (options: any) => {
    const config = options as IAppInsightConfig;
    const reactPlugin = new ReactPlugin();
    const ai = new ApplicationInsights({
      config: {
        instrumentationKey: config?.instrumentationKey,
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
  logMessage: (loggerInstance: any, message: string, options?: any) => {
    const appInsights = loggerInstance as ApplicationInsights;
    appInsights &&
      appInsights.trackTrace({
        message,
        severityLevel: SeverityLevel.Information
      });
  },
  logEvent: (loggerInstance: any, message: string, options?: any) => {
    const appInsights = loggerInstance as ApplicationInsights;
    appInsights &&
      appInsights.trackEvent({
        name: message
      });
  },
  logError: (loggerInstance: any, message: string, options?: any) => {
    const appInsights = loggerInstance as ApplicationInsights;
    appInsights &&
      appInsights.trackException({
        exception: new Error(message),
        severityLevel: SeverityLevel.Critical
      });
  }
};
