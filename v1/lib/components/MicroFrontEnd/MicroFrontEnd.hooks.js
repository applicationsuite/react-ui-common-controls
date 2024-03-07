var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useReducer } from 'react';
import { microFrontEndReducer } from './MicroFrontEnd.reducers';
import { MICRO_FRONTEND_ACTIONS } from './MicroFrontEnd.actions';
import { getMicroFrontEndDetails, loadMicroFrontEndManifest, unloadMicroFrontEnd } from './MicroFrontEnd.utils';
export const useInit = (props, onLoadComplete) => {
    const [state, dispatch] = useReducer(microFrontEndReducer, {});
    const actions = microFrontEndActions(dispatch, state);
    const unmountMicroFrontEnd = () => {
        unloadMicroFrontEnd(props, state);
    };
    useEffect(() => {
        let microFrontEndInfo = actions.initialize(props);
        microFrontEndInfo.onLoadComplete = onLoadComplete;
        function init() {
            return __awaiter(this, void 0, void 0, function* () {
                yield loadMicroFrontEndManifest(microFrontEndInfo);
            });
        }
        init();
        return unmountMicroFrontEnd;
    }, [props]);
    return { state: state, actions };
};
const microFrontEndActions = (dispatch, state) => {
    const actions = {
        initialize: (props) => {
            const initialData = getMicroFrontEndDetails(props);
            dispatch({ type: MICRO_FRONTEND_ACTIONS.INITIALIZE, data: initialData });
            return initialData;
        },
        updateData: (data) => {
            dispatch({ type: MICRO_FRONTEND_ACTIONS.UPDATE, data: data });
        }
    };
    return actions;
};
