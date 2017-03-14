import { pushRoute } from '../navigation/NavigationState';

const initialState = [];

const ADD_LIMIT = 'LimitsState/ADD_LIMIT';

export function addLimitObj(obj) {
    return {
        type: 'LimitsState/ADD_LIMIT',
        payload: obj
    };
}

export function addLimit(dispatch) {
        dispatch(pushRoute({key: 'EditLimit', title: `Edit Limits`, data: 'I came from Settings!'}));
        dispatch(addLimitObj({ title: 'NEW LIMIT23', decibelsValue: 1000, text: 'some text' }));
}

export default function limitState(state = initialState, action) {
    switch (action.type) {
        case ADD_LIMIT: {
            return [...state, action.payload];
        }
        default:
            return state;
    }
}
