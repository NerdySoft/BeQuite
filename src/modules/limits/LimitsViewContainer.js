import {connect} from 'react-redux';
import LimitsView from './LimitsView';

export default connect(
    state => {
        return {
            limits: state.getIn(['limits'])
        }
    }
)(LimitsView);
