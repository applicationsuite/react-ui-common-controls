import React from 'react';
import { IMicroFrontEndProps, ScriptLoadStatus } from './MicroFrontEnd.models';
import { useInit } from './MicroFrontEnd.hooks';
import { ProgressIndicator } from '@fluentui/react';

export const MicroFrontEnd = (props: IMicroFrontEndProps) => {
  const { state, actions } = useInit(props, onLoadComplete);

  function onLoadComplete(error: string) {
    actions.updateData({ status: ScriptLoadStatus.Complete, error: error });
    props.onLoadComplete && props.onLoadComplete(error);
  }
  return (
    <>
      {!state.status && <ProgressIndicator />}
      {props.showErrorOnLoadFailure && state.error && (
        <div style={{ textAlign: 'center' }}>
          Error in loading Microfrontend: <b>{state.hostName}</b>
        </div>
      )}
      <div id={`${state.containerName}`} dir="ltr" />
    </>
  );
};
