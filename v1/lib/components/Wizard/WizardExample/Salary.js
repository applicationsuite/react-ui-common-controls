import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export const Salary = (props) => {
    useEffect(() => {
        props.registerCallbacks && props.registerCallbacks(onValidate, subscribeToDependency);
    }, [props.dependencies]);
    function onValidate(stepData, dependencyData) {
        if (stepData.data.salary !== undefined) {
            stepData.valid = true;
        }
        return Object.assign({}, stepData);
    }
    function subscribeToDependency(dependency) { }
    const onChange = (e) => {
        const step = Object.assign({}, props);
        step.data.salary = e.target.value;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.salary
        };
        props.onChange && props.onChange(stepData);
    };
    const onNext = (e) => {
        const step = Object.assign({}, props);
        step.data.salary = props.data.salary;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.salary
        };
        props.onSubmitClick && props.onSubmitClick(stepData);
    };
    const onPrevious = (e) => {
        const step = Object.assign({}, props);
        step.data.salary = props.data.salary;
        const stepData = {
            id: step.id,
            data: step.data,
            valid: !!step.data.salary
        };
        props.onPreviousClick && props.onPreviousClick(stepData);
    };
    return (_jsxs(_Fragment, { children: ["Salary: ", _jsx("input", { type: "number", value: props.data.salary, onChange: onChange }, void 0), _jsx("button", Object.assign({ type: "submit", onClick: onNext }, { children: "Next" }), void 0), _jsx("button", Object.assign({ type: "button", onClick: onPrevious }, { children: "Previous" }), void 0)] }, void 0));
};
