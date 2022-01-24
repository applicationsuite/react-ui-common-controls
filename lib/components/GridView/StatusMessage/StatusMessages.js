import { jsx as _jsx } from "react/jsx-runtime";
import { createUseStyles } from 'react-jss';
import { StatusMessage } from './StatusMessage';
import { statusMessageStyles } from './StatusMessage.styles';
const useStyles = createUseStyles(statusMessageStyles);
export const StatusMessages = (props) => {
    const classes = useStyles();
    return (_jsx("div", Object.assign({ className: classes.statusMessages }, { children: props.messages &&
            props.messages.length > 0 &&
            props.messages.map((msg, id) => (_jsx(StatusMessage, Object.assign({}, msg, { onDismiss: props.onDismiss }), msg.id))) }), void 0));
};
