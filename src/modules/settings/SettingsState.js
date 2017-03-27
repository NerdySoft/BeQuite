import { Map, fromJS } from 'immutable';
import { switchTab } from '../navigation/NavigationState';

const initialState = Map({
    correction: 0,
    timeOfInitialCollect: 0,
    maxCountOfAlerts: 0,
    timeOfDangerCollect: 0
});

const SAVE_SETTINGS = 'SettingsState/SAVE_SETTINGS';

export function saveSettingsObj(value){
    return {
        type: SAVE_SETTINGS,
        payload: value
    }
}

export function saveSettings(obj){
    return dispatch => {
        dispatch(saveSettingsObj(obj));
        dispatch(switchTab('Home'))
    }
}

export default function SettingsStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SAVE_SETTINGS:
            return fromJS(action.payload);
        default:
            return state;
    }
}
