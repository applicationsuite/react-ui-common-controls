import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { LoggerContext } from '../Logger';
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        const { logError } = this.context;
        logError && logError('An unhandled error occured', errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return _jsx("h1", { children: "Something went wrong." }, void 0);
        }
        return this.props.children;
    }
}
ErrorBoundary.contextType = LoggerContext;
