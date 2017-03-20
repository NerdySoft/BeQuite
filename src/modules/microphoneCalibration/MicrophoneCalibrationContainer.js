import {connect} from 'react-redux';
import MicrophoneCalibrationView from './MicrophoneCalibrationView';

export default connect(
    state => ({
        correction: state.getIn(['amplitude', 'correction'])
    })
)(MicrophoneCalibrationView);
