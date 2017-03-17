import React, { PropTypes } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Button,
  Text,
  View,
  NativeModules,
  NativeAppEventEmitter,
  DeviceEventEmitter,
  Animated,
  Image,
  Easing
} from 'react-native';
import * as AmplitudeState from './AmplitudeState';
import { fromDecibels } from '../../services/mainService';

const AudioLevel = NativeModules.AudioLevel;
let amplitudeQueue = [];

let animation = null;

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
      this.spinValue = new Animated.Value(0);
      this.springValue = new Animated.Value(0.3);

      return {
        status: 'Click \'Start\' to measure noise',
        isAudioLevelActive: false,
        isAudioStarted: false,
      }
  },
  updateStatus(status) {
    this.setState({ status });
  },
  spring () {
    this.springValue.setValue(0.3)
    animation = Animated.spring(
        this.springValue,
        {
            toValue: 1,
            friction: 1
        }
    ).start(() => this.spring())
  },
  spin () {
    this.spinValue.setValue(0);
    Animated.timing(
        this.spinValue,
        {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear
        }
    ).start(() => this.spin())
  },
  componentDidMount() {
      const that = this;

      this.spring();

      NativeAppEventEmitter.addListener('recordingProgress', (data) => {
          const decibels = parseInt(fromDecibels(data.currentAmp));

          that.props.dispatch(AmplitudeState.load(decibels));
          that.processAmplitude(data.currentAmp).then(avg => {
              const decibels = fromDecibels(avg);
              const limit = that.findLimit(decibels);

              if(limit){
                const audioUri = limit.audio.value || '';
                that.stop();
                this.updateStatus(limit.message.value);
                AudioLevel.playSong(audioUri);
              }
          });
      });

      NativeAppEventEmitter.addListener('playerFinished', () => this.start());
      NativeAppEventEmitter.addListener('logger', (data) => console.error(data.error));
  },
  componentWillUnmount() {
    NativeAppEventEmitter.removeAllListeners();
    this.stop();
  },
  start() {
      Animated.spring.stopAnimation();
    // AudioLevel.startRecording();
    /*AudioLevel.start();
    this.setState({
      isAudioStarted: true,
      isAudioLevelActive: true,
      status: 'Listening...'
    });*/
  },
  stop(isForsed) {
    if (isForsed) {
      this.setState({ isAudioStarted: false });
    }

    // AudioLevel.stopRecording();
    AudioLevel.stop();
    amplitudeQueue = [];
    this.setState({ isAudioLevelActive: false, status: '' });

    return this.props.dispatch(AmplitudeState.reset());
  },
  async processAmplitude(newAmpValue) {
    amplitudeQueue.push(newAmpValue);

    if(amplitudeQueue.length === 10){
      amplitudeQueue.shift();
      return amplitudeQueue.reduce((total, current) => total + current, 0) / amplitudeQueue.length;
    }

    return 0;
  },
  findLimit(decibels) {
    let max = 0;
    let position = -1;

    this.props.limits.forEach((limit, index) => {
      const val = parseInt(limit.decibels.value);

      if (val < decibels && val > max) {
        max = val;
        position = index;
      }
    });

    return position >= 0 ? this.props.limits[position] : null;
  },
  render() {
    const loadingStyle = this.props.loading
      ? {backgroundColor: '#eee'} : null;
    const { isAudioLevelActive, isAudioStarted, status } = this.state;
      const spin = this.spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
      })


    return (
      <View style={styles.container}>
          <View>
              <Animated.Image
                  style={{ width: 227, height: 200, transform: [{ scale: this.springValue }] }}
                  source={{uri: 'https://s3.amazonaws.com/media-p.slid.es/uploads/alexanderfarennikov/images/1198519/reactjs.png'}}
              />
          </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={'Amplitude'}
          style={[styles.counterButton, loadingStyle]}>
          <Text style={styles.counter}>
            {this.props.amplitude}
          </Text>
        </TouchableOpacity>

        <Text >
          { status }
        </Text>

        <View style={styles.btnsContainer}>
            <Button onPress={this.start}
                title="Start"
                disabled={ isAudioStarted }
                color="steelblue"
                accessibilityLabel="Start"
              />
            <Button onPress={ () => this.stop(true) }
              title="Stop"
              disabled={ !isAudioLevelActive }
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
