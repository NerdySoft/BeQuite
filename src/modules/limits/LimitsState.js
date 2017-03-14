import { popRoute } from '../navigation/NavigationState';

const initialState = [];

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
            return [...state, action.payload];
        }
        default:
            return state;
    }
}
