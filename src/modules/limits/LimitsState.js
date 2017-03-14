import { pushRoute } from '../navigation/NavigationState';

const initialState = [];

const ADD_LIMIT = 'LimitsState/ADD_LIMIT';

export function addLimitObj(obj) {
    return {
        type: 'LimitsState/ADD_LIMIT',
        payload: obj
    };
}

export function addLimit(routeObj, limitObj) {
    return (dispatch)=>{
        dispatch(pushRoute(routeObj));
        dispatch(addLimitObj(limitObj));
    }
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
