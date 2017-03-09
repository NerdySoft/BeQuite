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
  chooseDecibels(value){
    
    },
  render() {
    const { decibels } = this.props;

    return (
      <View style={styles.container}>
        { decibels.map((value, index) =>
            <TouchableOpacity
                onPress={this.chooseDecibels}
                style={styles.limitButton}
                key={ `decibel-${index}` }>
              <Text style={styles.text}>{ value }</Text>
            </TouchableOpacity>) }
      </View>
    );
  }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    limitButton: {
        alignSelf: 'stretch',
        height: 70,
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    text: {
        paddingLeft: 10,
        fontSize: 20
    },
});

export default DecibelPickerView;
