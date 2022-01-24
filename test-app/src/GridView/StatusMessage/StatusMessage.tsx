import React from 'react';
import { createUseStyles } from 'react-jss';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { GridViewMessageType, IGridViewMessageData } from '../GridView.models';
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

type CombinedProps = IGridViewMessageData & {
  onDismiss: (messages: IGridViewMessageData) => void;
};

export const StatusMessage: React.FC<CombinedProps> = (props: CombinedProps) => {
  const classes = useStyles();
  const { id, messageType, message } = props;
  const type = MessageTypesMap[messageType];
  return (
    <>
      <MessageBar
        id={`alertsmessage ${id}`}
        messageBarType={type}
        isMultiline={false}
        className={type == MessageBarType.info ? classes.messageTypeInfo : classes.featureAlert}
        aria-label={`alert ${message}`}
        onDismiss={() => {
          props.onDismiss && props.onDismiss(props);
        }}
        dismissButtonAriaLabel="Close"
      >
        <span className="hide-action-statusmessage" /> {message}
      </MessageBar>
    </>
  );
};
