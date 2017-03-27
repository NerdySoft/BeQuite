import React, {PropTypes} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Animated,
    Image,
    Easing,
    NativeModules,
    NativeAppEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
import * as AmplitudeState from './AmplitudeState';
import {fromDecibels} from '../../services/mainService';
import ScaledButton from '../../components/ScaledButton';

const AudioLevel = NativeModules.AudioLevel;

let amplitudeQueue = [];

const CounterView = React.createClass({
    propTypes: {
        amplitude: PropTypes.number.isRequired,
        loading: PropTypes.bool.isRequired,
        loaded: PropTypes.bool.isRequired,
        intervId: PropTypes.number,
        dispatch: PropTypes.func.isRequired,
        limits: PropTypes.array.isRequired,
        settings: PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            status: 'Click \'Start\' to measure noise',
            image: null,
            isAudioLevelActive: false,
            isAudioStarted: false,
            showPlay: true,
            springValue: new Animated.Value(0.8),
            spinValue: new Animated.Value(0),
            alertsCount: 0,
            currentTime: 0
        }
    },
    componentDidMount() {
        const that = this;

        NativeAppEventEmitter.addListener('recordingProgress', (data) => {
            const correction = that.props.settings.correction;
            const decibels = parseInt(fromDecibels(data.currentAmp, correction));

            that.props.dispatch(AmplitudeState.load(decibels || 0));
            that.processAmplitude(data.currentAmp).then(avg => {
                const decibels = fromDecibels(avg, correction);
                const limit = that.findLimit(decibels);

                this.updateCurrentTime();

                if (!this.verifyCurrentTime()) {
                    this.resetAlertsIndicators();
                }

                if (limit) {
                    const audioUri = limit.audio.value || '';
                    const image = limit.image.value || '';
                    const status = limit.message.value || '';

                    this.stop();
                    this.increaseAlertsCount();

                    if (this.verifyAlertsCount()) {
                        AudioLevel.playSong(audioUri);

                        this.setState({ status, image });
                        this.stopSpinAnimation();
                        this.startButtonAnimation(0, 1, true);
                        this.startSpringAnimation();
                    } else {
                        // begin recording
                        console.log('DANGER ZONE VISITED');
                        this.resetAlertsIndicators();
                    }
                }
            });
        });

        NativeAppEventEmitter.addListener('playerFinished', () => {
            this.start();
            this.stopSpringAnimation();
            this.startButtonAnimation(1, 0, true);
        });
        NativeAppEventEmitter.addListener('logger', (data) => console.error(data.error));
    },
    componentWillUnmount() {
        NativeAppEventEmitter.removeAllListeners();
        this.stop();
    },
    resetAlertsIndicators() {
        this.setState({ alertsCount: 0, currentTime: 0 });
    },
    updateCurrentTime() {
        const currentTime = this.state.currentTime + 1;
        this.setState({ currentTime });
    },
    increaseAlertsCount() {
        const alertsCount = this.state.alertsCount + 1;
        this.setState({ alertsCount });
    },
    verifyCurrentTime() {
        const timeOfDangerCollect = this.props.settings.timeOfDangerCollect;

        return this.state.currentTime <= timeOfDangerCollect;
    },
    verifyAlertsCount() {
        const maxCountOfAlerts = this.props.settings.maxCountOfAlerts;

        return this.state.alertsCount <= maxCountOfAlerts;
    },
    startSpringAnimation () {
        this.state.springValue.setValue(0.8);

        Animated.spring(this.state.springValue, {
            toValue: 1,
            friction: 1
        }).start(o => o.finished && this.startSpringAnimation());
    },
    stopSpringAnimation () {
        this.state.springValue.stopAnimation();
    },
    startSpinAnimation () {
        this.state.spinValue.setValue(0);

        Animated.timing(this.state.spinValue, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear
        }).start(o => o.finished && this.startSpinAnimation());
    },
    stopSpinAnimation () {
        this.state.spinValue.stopAnimation();
    },
    start() {
        this.startSpinAnimation();

        //this.startSpringAnimation();
        // AudioLevel.startRecording();
        AudioLevel.start();
        this.setState({
            isAudioStarted: true,
            isAudioLevelActive: true,
            status: 'Listening...'
        });
    },
    stop(isForsed) {

        //  this.stopSpringAnimation();
        if (isForsed) {
            this.stopSpinAnimation();
            this.resetAlertsIndicators();
            this.setState({isAudioStarted: false});
        }

        // AudioLevel.stopRecording();
        AudioLevel.stop();
        amplitudeQueue = [];
        this.setState({isAudioLevelActive: false, status: ''});

        return this.props.dispatch(AmplitudeState.reset());
    },
    async processAmplitude(newAmpValue) {
        const times = parseInt(this.props.settings.timeOfInitialCollect);
        amplitudeQueue.push(newAmpValue);

        if (amplitudeQueue.length === times) {
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
        const {isAudioLevelActive, isAudioStarted, status, image, showPlay} = this.state;
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });


        return (
            <View style={styles.container}>
                <View style={{position: 'relative'}}>
                    {  (isAudioLevelActive || !isAudioStarted) && <Animated.Image
                        style={[styles.animatedImage, {transform: [{rotate: spin}]}]}
                        source={{uri: 'https://cdn2.iconfinder.com/data/icons/playstation-controller-buttons-3/64/playstation-flat-icon-circle-128.png'}}>
                        </Animated.Image>
                    }
                    { !isAudioLevelActive && isAudioStarted && <Animated.Image
                        style={[styles.animatedImage, {transform: [{scale: this.state.springValue}]}]}
                        source={{uri: image || 'https://cdn4.iconfinder.com/data/icons/ui-actions/21/refresh-128.png'}}>
                        </Animated.Image>
                    }
                    { isAudioLevelActive && <View style={ styles.textContainer }>
                        <Text style={{color: 'white'}}>
                            {this.props.amplitude}
                        </Text>
                    </View>}
                </View>
                <Text style={{ marginTop: 20, height: 20 }}>
                    { status }
                </Text>

                <ScaledButton
                    init={(func) => { this.startButtonAnimation = func }}
                    onPress={()=>!isAudioStarted ? this.start()  : isAudioLevelActive? this.stop(true) : null }
                    iconState1={require('../../../images/play-button.png')}
                    iconState2={require('../../../images/stop-button.png')}

                />
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
    counter: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    imageContainer: {},
    animatedImage: {
        width: 120,
        height: 120
    },
    textContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CounterView;
