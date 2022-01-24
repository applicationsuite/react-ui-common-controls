import { jsx as _jsx } from "react/jsx-runtime";
import { useInit } from './Logger.hooks';
import { LoggerContext } from './Logger.context';
export const Logger = (props) => {
    const { state, actions } = useInit(props);
    return _jsx(LoggerContext.Provider, Object.assign({ value: actions }, { children: props.children }), void 0);
};
