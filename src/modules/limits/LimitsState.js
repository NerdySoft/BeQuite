const initialState = [
    {
        title: 'New Limit',
        decibelsValue: 100,
        message: ''
    },
    {
        title: 'New Limit',
        decibelsValue: 100,
        message: ''
    },
    {
        title: 'New Limit',
        decibelsValue: 100,
        message: ''
    }
];

const EDIT_LIMIT = 'LimitsState/EDIT_LIMIT';

export function editLimit(id) {
    return {
        type: EDIT_LIMIT,
        payload: id
    };
}


export default function LimitsStateReducer(state = initialState, action) {
    switch (action.type) {

        case EDIT_LIMIT: {

            console.log("from reducer action");
            return state;
        }

        default:
            return state;
    }
}
