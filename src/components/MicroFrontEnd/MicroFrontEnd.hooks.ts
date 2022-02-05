import { useEffect, useReducer } from 'react';
import { microFrontEndReducer } from './MicroFrontEnd.reducers';
import { MICRO_FRONTEND_ACTIONS, IMicroFrontEndActions } from './MicroFrontEnd.actions';
import { IMicroFrontEndProps, IMicroFrontEndInfo, ScriptLoadStatus } from './MicroFrontEnd.models';
import {
  getMicroFrontEndDetails,
  loadMicroFrontEndManifest,
  unloadMicroFrontEnd
} from './MicroFrontEnd.utils';

export const useInit = (props: IMicroFrontEndProps, onLoadComplete: (error: string) => void) => {
  const [state, dispatch] = useReducer(microFrontEndReducer, {});
  const actions = microFrontEndActions(dispatch, state) as IMicroFrontEndActions;

  const unmountMicroFrontEnd = () => {
    unloadMicroFrontEnd(props, state);
  };

  useEffect(() => {
    let microFrontEndInfo = actions.initialize(props);
    microFrontEndInfo.onLoadComplete = onLoadComplete;
    async function init() {
      await loadMicroFrontEndManifest(microFrontEndInfo);
    }
    init();
    return unmountMicroFrontEnd;
  }, [props]);
  return { state: state as IMicroFrontEndInfo, actions };
};

const microFrontEndActions = (dispatch: any, state: IMicroFrontEndInfo) => {
  const actions: IMicroFrontEndActions = {
    initialize: (props: IMicroFrontEndProps) => {
      const initialData: IMicroFrontEndInfo = getMicroFrontEndDetails(props);
      dispatch({ type: MICRO_FRONTEND_ACTIONS.INITIALIZE, data: initialData });
      return initialData;
    },
    updateData: (data: any) => {
      dispatch({ type: MICRO_FRONTEND_ACTIONS.INITIALIZE, data: data });
    }
  };
  return actions;
};
