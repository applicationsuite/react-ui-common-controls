import React from 'react';
import { createUseStyles } from 'react-jss';
import { IStatusMessageProps } from '../GridView.models';
import { StatusMessage } from './StatusMessage';
import { statusMessageStyles } from './StatusMessage.styles';

const useStyles = createUseStyles(statusMessageStyles);

export const StatusMessages = (props: IStatusMessageProps) => {
  const classes = useStyles();
  return (
    <div className={classes.statusMessages}>
      {props.messages &&
        props.messages.length > 0 &&
        props.messages.map((msg, id) => (
          <StatusMessage key={msg.id} {...msg} onDismiss={props.onDismiss!} />
        ))}
    </div>
  );
};
