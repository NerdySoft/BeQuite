const INITIAL_STATE = [{
    title: 'Test Limit',
    decibelsValue: 10,
    text: 'TestLimittext',

}];

const EDIT_LIMIT = 'LimitsState/EDIT_LIMIT';

export function editLimit(id) {
    return {
        type: EDIT_LIMIT,
        payload: id
    };
}


export default  (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case EDIT_LIMIT: {
            console.log("from reducer action");
            return {...state, [action.payload.prop]: action.payload.value};
        }

        default:
            return state;
    }
}
