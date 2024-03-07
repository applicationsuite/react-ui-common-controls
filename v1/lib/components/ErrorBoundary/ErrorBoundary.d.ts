import React from 'react';
interface IProps {
}
interface IState {
    hasError: boolean;
}
export declare class ErrorBoundary extends React.Component<IProps, IState> {
    static contextType: React.Context<import("../Logger/Logger.actions").ILoggerActions | undefined>;
    constructor(props: any);
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
    };
    componentDidCatch(error: any, errorInfo: any): void;
    render(): React.ReactNode;
}
export {};
