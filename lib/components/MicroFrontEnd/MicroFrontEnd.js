import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ScriptLoadStatus } from './MicroFrontEnd.models';
import { useInit } from './MicroFrontEnd.hooks';
import { ProgressIndicator } from '@fluentui/react';
export const MicroFrontEnd = (props) => {
    const { state, actions } = useInit(props, onLoadComplete);
    function onLoadComplete(error) {
        actions.updateData({ status: ScriptLoadStatus.Complete, error: error });
        props.onLoadComplete && props.onLoadComplete(error);
    }
    return (_jsxs(_Fragment, { children: [!state.status && _jsx(ProgressIndicator, {}, void 0), props.showErrorOnLoadFailure && state.error && (_jsxs("div", Object.assign({ style: { textAlign: 'center' } }, { children: ["Error in loading Microfrontend: ", _jsx("b", { children: state.hostName }, void 0)] }), void 0)), _jsx("div", { id: `${state.containerName}`, dir: "ltr" }, void 0)] }, void 0));
};
