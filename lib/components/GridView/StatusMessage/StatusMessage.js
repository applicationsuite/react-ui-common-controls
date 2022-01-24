import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { GridViewMessageType } from '../GridView.models';
import { statusMessageStyles } from './StatusMessage.styles';
const useStyles = createUseStyles(statusMessageStyles);
const MessageTypesMap = {
    [GridViewMessageType.Information]: MessageBarType.info,
    [GridViewMessageType.Success]: MessageBarType.success,
    [GridViewMessageType.Warning]: MessageBarType.warning,
    [GridViewMessageType.Error]: MessageBarType.error,
    [GridViewMessageType.SevereWarning]: MessageBarType.severeWarning,
    [GridViewMessageType.Blocked]: MessageBarType.blocked
};
export const StatusMessage = (props) => {
    const classes = useStyles();
    const { id, messageType, message } = props;
    const type = MessageTypesMap[messageType];
    return (_jsx(_Fragment, { children: _jsxs(MessageBar, Object.assign({ id: `alertsmessage ${id}`, messageBarType: type, isMultiline: false, className: type == MessageBarType.info ? classes.messageTypeInfo : classes.featureAlert, "aria-label": `alert ${message}`, onDismiss: () => {
                props.onDismiss && props.onDismiss(props);
            }, dismissButtonAriaLabel: "Close" }, { children: [_jsx("span", { className: "hide-action-statusmessage" }, void 0), " ", message] }), void 0) }, void 0));
};
