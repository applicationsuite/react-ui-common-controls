import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export const Employee = (props) => {
    useEffect(() => {
        props.registerCallbacks && props.registerCallbacks(onValidate, subscribeToDependency);
    }, [props.dependencies]);
    function onValidate(stepData, dependencyData) {
        if (stepData.data.empName !== undefined) {
            stepData.valid = true;
        }
        return Object.assign({}, stepData);
    }
    function subscribeToDependency(dependency) {
        console.log(dependency);
    }
    const onChange = (e) => {
        const step = Object.assign({}, props);
        step.data.empName = e.target.value;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.empName
        };
        props.onChange && props.onChange(stepData);
    };
    const onNext = (e) => {
        const step = Object.assign({}, props);
        step.data.empName = props.data.empName;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.empName
        };
        props.onSubmitClick && props.onSubmitClick(stepData);
    };
    const onPrevious = (e) => {
        const step = Object.assign({}, props);
        step.data.empName = props.data.empName;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.empName
        };
        props.onPreviousClick && props.onPreviousClick(stepData);
    };
    return (_jsxs(_Fragment, { children: ["Employee: ", _jsx("input", { type: "text", value: props.data.empName, onChange: onChange }, void 0), _jsx("button", Object.assign({ type: "submit", onClick: onNext }, { children: "Next" }), void 0), _jsx("button", Object.assign({ type: "button", onClick: onPrevious }, { children: "Previous" }), void 0)] }, void 0));
};
