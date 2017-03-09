/*eslint-disable react/prop-types*/

import React from 'react';
import AmplitudeViewContainer from './amplitude/AmplitudeViewContainer';
import ColorViewContainer from './settings/SettingsViewContainer';
import DecibelPickerContainer from './decibelPicker/DecibelPickerViewContainer';
import LimitsViewContainer from './limits/LimitsViewContainer';
/**
 * AppRouter is responsible for mapping a navigator scene to a view
 */
export default function AppRouter(props) {
  const key = props.scene.route.key;

  if (key === 'Amplitude') {
    return <AmplitudeViewContainer />;
  }

  if (key === 'Decibel') {
    return <DecibelPickerContainer />;
  }

  if (key === 'Limits') {
    return <LimitsViewContainer />;
  }

  if (key.indexOf('Color') === 0) {
    const index = props.scenes.indexOf(props.scene);
    return (
      <ColorViewContainer
        index={index}
      />
    );
  }

  throw new Error('Unknown navigation key: ' + key);
}
