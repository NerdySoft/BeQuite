import { Map, fromJS } from 'immutable';

const initialState = Map({
    correction: 0,
    timeOfInitialCollect: 0,
    maxCountOfAlerts: 0,
    timeOfDangerCollect: 0
});

const SAVE_SETTINGS = 'SettingsState/SAVE_SETTINGS';

export function saveSettings(value){
    return {
        type: SAVE_SETTINGS,
        payload: value
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
