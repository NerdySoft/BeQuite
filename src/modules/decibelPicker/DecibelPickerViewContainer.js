import {connect} from 'react-redux';
import DecibelPickerView from './DecibelPickerView';

export default connect(
    state => {
        return {
            decibels: state.getIn(['decibels']),
        }
    }
)(DecibelPickerView);
