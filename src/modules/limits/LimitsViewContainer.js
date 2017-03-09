import {connect} from 'react-redux';
import LimitsView from './LimitsView';
import {editLimit} from './LimitsState';

export default connect(
    state => {
        return {
            limits: state.getIn(['limits'])
        }
    },
    dispatch => ({
        editLimit(id) {
            dispatch(editLimit(id));
        },
    })
)(LimitsView);
