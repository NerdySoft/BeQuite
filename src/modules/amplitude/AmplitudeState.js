import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

const initialState = Map({
  value: 0,
  intervId: 0,
  loading: false,
  loaded: false,
  correction: 0
});

const LOAD = 'AmplitudeState/LOAD';
const INIT = 'AmplitudeState/INIT';
const RESET = 'AmplitudeState/RESET';
const CHANGE_CORRECTION = 'AmplitudeState/CHANGE_CORRECTION';

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

export function changeCorrection(value){
  return {
    type: CHANGE_CORRECTION,
    payload: value
  }
}

export default function CounterStateReducer(state = initialState, action = {}) {
  switch (action.type) {
    case INIT:
      return state.merge({ 'intervId': action.payload, 'loaded': true });
    case LOAD:
      return state.update('value', value => action.payload);
    case RESET:
      return state.merge({ 'value': 0, 'intervId': 0, 'loaded': false });
    case CHANGE_CORRECTION:
      return state.update('correction', correction => action.payload);
    default:
      return state;
  }
}
