import {Map, fromJS} from 'immutable';
import {loop, combineReducers} from 'redux-loop';
import NavigationStateReducer from '../modules/navigation/NavigationState';
import AmplitudeStateReducer from '../modules/amplitude/AmplitudeState';
import DecibelPickerStateReducer from '../modules/decibelPicker/DecibelPickerState';
import SessionStateReducer, {RESET_STATE} from '../modules/session/SessionState';
import LimitsStateReducer from '../modules/limits/LimitsState';
import SettingsStateReducer from '../modules/settings/SettingsState';

const reducers = {
    settings: SettingsStateReducer,
    amplitude: AmplitudeStateReducer,
    decibels: DecibelPickerStateReducer,
    limits: LimitsStateReducer,
    navigationState: NavigationStateReducer,
    session: SessionStateReducer
};

// initial state, accessor and mutator for supporting root-level
// immutable data with redux-loop reducer combinator
const immutableStateContainer = Map();
const getImmutable = (child, key) => child ? child.get(key) : void 0;
const setImmutable = (child, key, value) => child.set(key, value);

const namespacedReducer = combineReducers(
    reducers,
    immutableStateContainer,
    getImmutable,
    setImmutable
);

export default function mainReducer(state, action) {
    const [nextState, effects] = action.type === RESET_STATE
        ? namespacedReducer(action.payload, action)
        : namespacedReducer(state || void 0, action);

    // enforce the state is immutable
    return loop(fromJS(nextState), effects);
}
