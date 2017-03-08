import React, { PropTypes } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Button,
  Text,
  View,
  NativeModules,
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';

const DecibelPickerView = React.createClass({
  render() {
    const { decibels } = this.props;

    return (
      <View style={styles.container}>
        { decibels.map((value, index) => <Text key={ `decibel-${index}` }>{ value }</Text>) }
      </View>
    );
  }
});

const circle = {
  borderWidth: 0,
  borderRadius: 40,
  width: 80,
  height: 80
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  counterButton: {
    ...circle,
    backgroundColor: 'skyblue',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 150,
    margin: 30
  },
  counter: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default DecibelPickerView;
