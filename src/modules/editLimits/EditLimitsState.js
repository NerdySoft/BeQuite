/*import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop';

 const initialState = Map({
 title: '',
 limitId: null,
 limitMessage: '',
 limit: 60
 });

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

export function remove(limitId) {
    return {
        type: REMOVE,
        payload: limitId
    };
}

export default function EditLimitStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ADD:
            return state.push(action.payload);
        case EDIT:
            return state.update('value', value => action.payload);
        case REMOVE:
            return state.merge({ 'value': 0, 'intervId': 0, 'loaded': false });
        default:
            return state;
    }
}*/


const initialState = [];

export default function EditLimitStateReducer(state = initialState) {
    return state;
}

