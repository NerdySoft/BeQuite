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
