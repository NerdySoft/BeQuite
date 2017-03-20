/*eslint-disable react/prop-types*/

import React from 'react';
import AmplitudeViewContainer from './amplitude/AmplitudeViewContainer';
import SettingsViewContainer from './settings/SettingsViewContainer';
import DecibelPickerContainer from './decibelPicker/DecibelPickerViewContainer';

import LimitsViewContainer from './limits/LimitsViewContainer';
import EditLimitContainer from './editLimits/EditLimitsViewContainer';
import MicrophoneCalibrationContainer from './microphoneCalibration/MicrophoneCalibrationContainer';


/**
 * AppRouter is responsible for mapping a navigator scene to a view
 */
export default function AppRouter(props) {
  const key = props.scene.route.key;
  const data = props.scene.route.data;

  if (key === 'Amplitude') {
    return <AmplitudeViewContainer />;
  }

  if (key === 'Decibel') {
    return <DecibelPickerContainer data={ data } />;
  }
  if (key === 'EditLimit') {
        return <EditLimitContainer data={ data } />;
  }

  if (key === 'Limits') {
    return <LimitsViewContainer />;
  }

  if (key === 'Settings') {
    return <SettingsViewContainer/>;
  }
  if(key === 'MicCalibration'){
    return <MicrophoneCalibrationContainer/>
  }

  throw new Error('Unknown navigation key: ' + key);
}
