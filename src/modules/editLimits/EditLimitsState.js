/*
import {loop, Effects} from 'redux-loop';

const initialState = [];

const ADD = 'EditLimitState/ADD';
const EDIT = 'EditLimitState/EDIT';
const REMOVE = 'EditLimitState/REMOVE';

export function addLimit(limit) {
    return {
        type: ADD,
        payload: limit
    };
}

export function edit(limitId) {
    return {
        type: EDIT,
        payload: limitId
    };
}

export function remove() {
    return { type: REMOVE };
}

export default function EditLimitStateReducer(state = initialState, action = {}) {
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
*/
const initialState = [];

export default function EditLimitStateReducer(state = initialState) {
    return state;
}
