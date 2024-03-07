import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';
export const AppInsightPageTracker = (Component, title) => withAITracking(new ReactPlugin(), Component, title);
