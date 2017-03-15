import * as AmplitudeState from './AmplitudeState';
import * as NavigationState from '../../modules/navigation/NavigationState';
import React, {PropTypes} from 'react';
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

var AudioLevel  = NativeModules.AudioLevel;

const CounterView = React.createClass({
  propTypes: {
    amplitude: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    intervId: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  },
  getInitialState() {
      return {
        levels: {
          low: 2000,
          medium: 8000,
          high: 12000
        },
        status: 'Click \'Start\' to measure noise',
        isAudioLevelActive: true
      }
  },
  updateStatus(amp) {
    const levels = this.state.levels;
    let status;

      if (amp <= levels.low)
        status = 'Very quiet and calm family';
      else if (amp > levels.low && amp <= levels.medium)
        status = 'Look, that boy opened mouth';
      else if (amp > levels.medium && amp <= levels.high)
        status = 'Hey Peter, dress down that b*tch!';
      else if (amp > levels.high)
        status = 'What the hell is that, shut up everybody!';

      this.setState({ status: status });
  },
  start() {
    const that = this;

    NativeAppEventEmitter.addListener('recordingProgress', (data) => {
        that.props.dispatch(AmplitudeState.load(data.currentAmp));
        that.updateStatus(data.currentAmp);
    });
      NativeAppEventEmitter.addListener('chosenFleURI', (data) => {
          console.log(data.fileURI);
          AudioLevel.playSong(data.fileURI);
      });
      //need to get error message from java side
      NativeAppEventEmitter.addListener('logger', (data) => {

        console.log(data.error);
      });


      this.setState({isAudioLevelActive: false})
   //AudioLevel.start();
   // AudioLevel.startRecording();//start recording audio
   //AudioLevel.playSong(''); //play default song
      //AudioLevel.playSong(fileURI); //play song by uri
    AudioLevel.chooseAudio();
  },
  stop() {
    this.setState({isAudioLevelActive: true})
    AudioLevel.stop();
    //AudioLevel.stopRecording() //stop recording audio

    this.setState({ status: '' });

    return this.props.dispatch(AmplitudeState.reset());
  },
  render() {
    const loadingStyle = this.props.loading
      ? {backgroundColor: '#eee'}
      : null;
      const isAudioLevelActive = this.state.isAudioLevelActive;
    //const isAudioLevelActive = this.props.loaded;
    const statusMessage = this.state.status;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={'Amplitude'}
          style={[styles.counterButton, loadingStyle]}>
          <Text style={styles.counter}>
            {this.props.amplitude}
          </Text>
        </TouchableOpacity>

        <Text >
          { statusMessage }
        </Text>

        <View style={styles.btnsContainer}>
            <Button onPress={this.start}
                disabled={!isAudioLevelActive}
                title="Start"
                color="steelblue"
                accessibilityLabel="Start"
              />
            <Button onPress={this.stop}
              disabled={isAudioLevelActive}
              title="Stop"
              color="steelblue"
              accessibilityLabel="Stop"
            />
        </View>
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

export default CounterView;
