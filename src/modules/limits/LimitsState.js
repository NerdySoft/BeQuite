import { List, fromJS } from 'immutable';
import { popRoute } from '../navigation/NavigationState';

const initialState = List([]);

const SAVE_LIMIT = 'LimitsState/SAVE_LIMIT';
const REMOVE_LIMIT = 'LimitsState/REMOVE_LIMIT';

export function saveLimitObj(obj) {
    return {
        type: 'LimitsState/SAVE_LIMIT',
        payload: obj
    };
}

export function removeLimitObj(id) {
    return {
        type: 'LimitsState/REMOVE_LIMIT',
        payload: id
    };
}

export function saveLimit(limitObj) {
    return dispatch => {
        dispatch(saveLimitObj(limitObj));
        dispatch(popRoute());
    }
}

export function removeLimit(id) {
    return dispatch => {
        dispatch(removeLimitObj(id));
        dispatch(popRoute());
    }
}

export default function limitState(state = initialState, action) {
    switch (action.type) {
        case SAVE_LIMIT: {
            let _state = state.toJS();
            const index = _state.findIndex(limit => limit.id === action.payload.id);

            if (index > -1) {
                _state[index] = action.payload;
            } else {
                _state = [..._state, action.payload];
            }

            return fromJS(_state);
        }
        case REMOVE_LIMIT: {
            let _state = state.toJS();
            _state = _state.filter(limit => limit.id !== action.payload);

            return fromJS(_state);
        }
        default:
            return state;
    }
}
