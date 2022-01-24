import { useEffect, useReducer } from 'react';
import { appWrapperReducer } from './AppWrapper.reducers';
import { APP_WRAPPER_ACTIONS } from './AppWrapper.actions';
export const useInit = (props) => {
    const [state, dispatch] = useReducer(appWrapperReducer, {});
    const actions = appWrapperActions(dispatch, state);
    useEffect(() => {
        actions.initialize(props);
    }, [props]);
    return { state: state, actions };
};
const appWrapperActions = (dispatch, state) => {
    const actions = {
        initialize: (props) => {
            const initialData = {
                loggerInfo: props.loggerInfo,
                language: props.language,
                localizationData: props.localizationData,
                userInfo: props.userInfo,
                theme: props.theme,
                data: props.data
            };
            dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: initialData });
        },
        setTheme: (theme) => {
            const stateToUpdate = state;
            state.theme = theme;
            dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: stateToUpdate });
        },
        setLanguage: (language) => {
            const stateToUpdate = state;
            state.language = language;
            dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: stateToUpdate });
        },
        setUserInfo: (userInfo) => {
            const stateToUpdate = state;
            state.userInfo = userInfo;
            dispatch({ type: APP_WRAPPER_ACTIONS.INITIALIZE, data: stateToUpdate });
        },
        setAppData: (data) => {
            dispatch({ type: APP_WRAPPER_ACTIONS.SET_APP_DATA, data });
        }
    };
    return actions;
};
