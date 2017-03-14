import { List, fromJS } from 'immutable';
import { popRoute } from '../navigation/NavigationState';

const initialState = List([]);

const SAVE_LIMIT = 'LimitsState/SAVE_LIMIT';

export function saveLimitObj(obj) {
    return {
        type: 'LimitsState/SAVE_LIMIT',
        payload: obj
    };
}

export function saveLimit(limitObj) {
    return dispatch => {
        dispatch(saveLimitObj(limitObj));
        dispatch(popRoute());
    }
}

export default function limitState(state = initialState, action) {
    switch (action.type) {
        case SAVE_LIMIT: {
            const _state = state.toJS();
            return fromJS([..._state, action.payload]);
        }
        default:
            return state;
    }
}
