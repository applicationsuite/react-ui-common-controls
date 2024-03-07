import React from 'react';
import { IGridViewMessageData } from '../GridView.models';
declare type CombinedProps = IGridViewMessageData & {
    onDismiss: (messages: IGridViewMessageData) => void;
};
export declare const StatusMessage: React.FC<CombinedProps>;
export {};
