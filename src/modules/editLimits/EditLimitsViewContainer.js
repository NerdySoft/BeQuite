/*
import {connect} from 'react-redux';
import EditLimitsView from './EditLimitsView';

export default connect(
    state => ({
        title: state.getIn(['limits', 'title']),
        limitId: state.getIn(['limits', 'limitId']),
        limitMessage: state.getIn(['limits', 'limitMessage']),
        limit: state.getIn(['limits', 'limit'])
    })
)(EditLimitsView);
*/
import {connect} from 'react-redux';
import EditLimitsView from './EditLimitsView';

export default connect(
    state => {
        console.log(state);
        return {
            limits: state.getIn(['limits']),
        }
    }
)(EditLimitsView);
