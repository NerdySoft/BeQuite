import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

const initialState = Map({
  value: 0,
  intervId: 0,
  loading: false,
  loaded: false
});

const LOAD = 'AmplitudeState/LOAD';
const INIT = 'AmplitudeState/INIT'
const RESET = 'AmplitudeState/RESET';

export function load(amplitude) {
  return {
    type: LOAD,
    payload: amplitude
  };
}

export function init(intervId) {
  return {
    type: INIT,
    payload: intervId
  };
}

export function reset() {
  return { type: RESET };
}

export default function CounterStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case INIT:
      return state.merge({ 'intervId': action.payload, 'loaded': true });
    case LOAD:
      return state.update('value', value => action.payload);
    case RESET:
      return state.merge({ 'value': 0, 'intervId': 0, 'loaded': false });
    default:
      return state;
  }
}
