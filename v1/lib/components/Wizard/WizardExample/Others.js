import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export const Others = (props) => {
    useEffect(() => {
        props.registerCallbacks && props.registerCallbacks(onValidate, subscribeToDependency);
    }, [props.dependencies]);
    function onValidate(stepData, dependencyData) {
        if (stepData.data.comments !== undefined) {
            stepData.valid = true;
        }
        return Object.assign({}, stepData);
    }
    function subscribeToDependency(dependency) { }
    const onChange = (e) => {
        const step = Object.assign({}, props);
        step.data.comments = e.target.value;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.comments
        };
        props.onChange && props.onChange(stepData);
    };
    const onPrevious = (e) => {
        const step = Object.assign({}, props);
        step.data.comments = props.data.comments;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.comments
        };
        props.onPreviousClick && props.onPreviousClick(stepData);
    };
    return (_jsxs(_Fragment, { children: ["Comments: ", _jsx("input", { type: "string", value: props.data.comments, onChange: onChange }, void 0), _jsx("button", Object.assign({ type: "button", onClick: onPrevious }, { children: "Previous" }), void 0)] }, void 0));
};
