import * as AmplitudeState from './AmplitudeState';
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
import { fromDecibels } from '../../services/mainService';

var AudioLevel  = NativeModules.AudioLevel;
let amplitudeQueue = []//new Array(30).fill(0);

const CounterView = React.createClass({
  propTypes: {
    amplitude: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    intervId: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    limits: PropTypes.array.isRequired
  },
  getInitialState() {
      return {
        levels: {
          low: 2000,
          medium: 8000,
          high: 12000
        },
        status: 'Click \'Start\' to measure noise',
        mounted: false,
        /*isAudioLevelActive: true*/
      }
  },
  componentDidMount() {
    this.setState({ mounted:  true });

      const that = this;
      NativeAppEventEmitter.addListener('recordingProgress', (data) => {
          const decibels = parseInt(fromDecibels(data.currentAmp));

          that.props.dispatch(AmplitudeState.load(decibels));
          that.updateStatus(data.currentAmp);
          console.log('====================================================currentAmp', data.currentAmp);
          this.processAmplitude(data.currentAmp).then(avg => {
              console.log('================================================avg', avg);
              const decibels = fromDecibels(avg);
              const limit = this.findLimit(decibels);

              console.log('decibels', decibels, limit);

              if(limit){
                  const audioUri = limit.audio.value || '';
                  console.log(audioUri);
                  //debugger;
                  amplitudeQueue =[];
                  console.log('=======================================================-------amplitude.length', amplitudeQueue.length);
                  AudioLevel.playSong(audioUri);
                  //amplitudeQueue =[]//.fill(0);//ohiho
                  that.stop();
              }
          });
      });

      NativeAppEventEmitter.addListener('playerFinished', () => {
          this.start();
      });


      NativeAppEventEmitter.addListener('chosenFleURI', (data) => {
          //AudioLevel.playSong(data.fileURI);
      });

      //need to get error message from java side
      NativeAppEventEmitter.addListener('logger', (data) => {
          console.log('================================================================ ', data.error);
      });

      NativeAppEventEmitter.addListener('getAudioDuration', (duration) => {
          console.log('duration: ', duration.duration)
      });



  },
  componentWillUnmount() {
      NativeAppEventEmitter.removeAllListeners();
    this.stop();
    this.setState({ mounted:  false });
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

      if (this.state.mounted) {
        this.setState({status: status});
      }
  },
  start() {
    //AudioLevel.playSong('content://com.android.providers.media.documents/document/audio%3A43');
    //return;


    if (this.state.mounted) {


      // this.setState({isAudioLevelActive: false});
      AudioLevel.start();
      //AudioLevel.startRecording();//start recording audio
      //AudioLevel.playSong(''); //play default song
      //AudioLevel.playSong(fileURI); //play song by uri
      //AudioLevel.chooseAudio();
    }

  },
  async processAmplitude(newAmpValue) {
      amplitudeQueue.push(newAmpValue);
      console.log('====================================================================amplitude.length', amplitudeQueue.length);
      if(amplitudeQueue.length === 31){
          amplitudeQueue.shift();
          return amplitudeQueue.reduce((total, current) => total + current, 0) / amplitudeQueue.length;
      }
      return 0;
  },
  findLimit(decibels) {
    return this.props.limits.filter(limit => parseInt(limit.decibels.value) < decibels).pop();
  },
  stop() {
    if (this.state.mounted) {
      AudioLevel.stop();
      //amplitudeQueue.fill(0);
      amplitudeQueue = [];

      // this.setState({isAudioLevelActive: true});
      // AudioLevel.stopRecording() //stop recording audio
      //this.setState({ status: '' });

      return this.props.dispatch(AmplitudeState.reset());
    }
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
                title="Start"
                color="steelblue"
                accessibilityLabel="Start"
              />
            <Button onPress={this.stop}
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
