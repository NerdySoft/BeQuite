import {connect} from 'react-redux';
import DecibelPickerView from './DecibelPickerView';

export default connect(
    state => {
        console.log(state);
        return {
            decibels: state.getIn(['decibels']),
        }
    }
)(DecibelPickerView);
