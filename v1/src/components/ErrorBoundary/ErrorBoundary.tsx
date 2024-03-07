import React from 'react';
import { LoggerContext } from '../Logger';

interface IProps {}

interface IState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<IProps, IState> {
  static contextType = LoggerContext;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    const { logError } = this.context;
    logError && logError('An unhandled error occured', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
