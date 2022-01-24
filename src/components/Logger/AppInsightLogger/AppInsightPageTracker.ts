import { ReactPlugin, withAITracking } from '@microsoft/applicationinsights-react-js';

export const AppInsightPageTracker = (Component: any, title: string) =>
  withAITracking(new ReactPlugin(), Component, title);
