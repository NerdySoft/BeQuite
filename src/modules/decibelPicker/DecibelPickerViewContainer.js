import {connect} from 'react-redux';
import DecibelPickerView from './DecibelPickerView';
import { setSceneParams, popRoute } from '../../modules/navigation/NavigationState';

export default connect(
    state => {
        return {
            decibels: state.get('decibels')
        }
    },
    dispatch => ({
        setSceneParams(params) {
            dispatch(setSceneParams(params));
        },
        onNavigateBack() {
            dispatch(popRoute());
        },
    })
)(DecibelPickerView);