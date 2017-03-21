import React, { PropTypes } from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';
import { saveLimit } from '../limits/LimitsState'
import { pushRoute } from '../navigation/NavigationState';
import SettingsItem from '../../components/SettingsItem';

const SettingsView = React.createClass({
    propTypes: {
        dispatch: PropTypes.func.isRequired,
    },
    goToLimits() {
        this.props.dispatch(pushRoute({
            key: 'Limits',
            title: `Limits`,
            showRightComponent: 'true',
            iconName: 'plus',
            // rightComponentAction for plus button
            rightComponentAction: () => this.props.dispatch(pushRoute({
                key: 'EditLimit',
                title: `Edit Limit`,
                data: { isUpdate: false },
                showRightComponent: 'true',
                iconName: 'save',
            }))
        }));
    },
    goToCalibration(){
        this.props.dispatch(pushRoute({
            key: 'MicCalibration',
            title: `Microphone Calibration`,
            showRightComponent: 'true',
            iconName: 'save',
        }));
    },
    render() {
        return (
            <View style={ [styles.container] }>
                <SettingsItem onPress={ this.goToLimits } keyProp={ 'limits' } icon="volume-down" text="Limits"/>
                <SettingsItem onPress={ this.goToCalibration } keyProp={ 'calibration' } icon="microphone" text="Microphone Calibration"/>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default SettingsView;
