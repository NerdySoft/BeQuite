import React, {PropTypes} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Button,
    Text,
    View,
    Animated,
    Image,
    Easing,
    NativeModules,
    NativeAppEventEmitter,
    DeviceEventEmitter,
    TouchableWithoutFeedback
} from 'react-native';
import * as AmplitudeState from './AmplitudeState';
import {fromDecibels} from '../../services/mainService';

const AudioLevel = NativeModules.AudioLevel;

let amplitudeQueue = [];

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
            status: 'Click \'Start\' to measure noise',
            image: null,
            isAudioLevelActive: false,
            isAudioStarted: false,
            showPlay: true,
            springValue: new Animated.Value(0.8),
            spinValue: new Animated.Value(0),
            animatedValue: new Animated.Value(0)
        }
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
    startButtonAnimation(animateFrom, animateTo, executeOnce){
        this.state.animatedValue.setValue(animateFrom);

        Animated.timing(this.state.animatedValue, {
            toValue: animateTo,
            duration: 400,
            easing: Easing.linear
        }).start(o => {
            !executeOnce ? this.setState({showPlay: !this.state.showPlay}) : '';
            return o.finished && !executeOnce && this.startButtonAnimation(1, 0, true)
        });
    },
    stopButtonAnimation(){
        this.state.animatedValue.stopAnimation();
    },
    componentDidMount() {
        const that = this;

        NativeAppEventEmitter.addListener('recordingProgress', (data) => {
            const decibels = parseInt(fromDecibels(data.currentAmp, that.props.correction));

            that.props.dispatch(AmplitudeState.load(decibels || 0));
            that.processAmplitude(data.currentAmp).then(avg => {
                const decibels = fromDecibels(avg, that.props.correction);
                const limit = that.findLimit(decibels);

                if (limit) {
                    const audioUri = limit.audio.value || '';
                    const image = limit.image.value || '';
                    const status = limit.message.value || '';

                    that.stop();
                    AudioLevel.playSong(audioUri);
                    that.startButtonAnimation(0, 1, true);
                    this.setState({ status, image });

                    this.stopSpinAnimation();
                    this.startSpringAnimation();
                }
            });
        });

        NativeAppEventEmitter.addListener('playerFinished', () => {
            this.start();
            this.stopSpringAnimation();
            //this.startSpinAnimation();
            this.startButtonAnimation(1, 0, true);
        });
        NativeAppEventEmitter.addListener('logger', (data) => console.error(data.error));
    },
    componentWillUnmount() {
        NativeAppEventEmitter.removeAllListeners();
        this.stop();
    },
    start(isForsed) {
        this.startSpinAnimation();
        if(isForsed){
            this.startButtonAnimation(0, 1);
        }

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
            this.startButtonAnimation(0, 1);
            this.stopSpinAnimation();
            this.setState({isAudioStarted: false});
        }

        // AudioLevel.stopRecording();
        AudioLevel.stop();
        amplitudeQueue = [];
        this.setState({isAudioLevelActive: false, status: ''});

        return this.props.dispatch(AmplitudeState.reset());
    },
    async processAmplitude(newAmpValue) {
        amplitudeQueue.push(newAmpValue);

        if (amplitudeQueue.length === 31) {
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

        const buttonSize = this.state.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [120, 130, 0]
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

                <View style={styles.btnsContainer}>
                    <TouchableWithoutFeedback onPress={()=>!isAudioStarted ? this.start(true) : isAudioLevelActive? this.stop(true) : null }
                                              title="Start"
                                              //disabled={ !isAudioLevelActive }
                                              color="steelblue"
                                              accessibilityLabel="Start"
                    >
                        <Animated.Image
                            style={[styles.animatedImage, {width: buttonSize || 120, height: buttonSize || 120}]}
                            source={
                                showPlay ?
                                require('../../../images/play-button.png') :
                                    !showPlay ?
                                require('../../../images/stop-button.png') : null
                            }>
                        </Animated.Image>
                    </TouchableWithoutFeedback>

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
        justifyContent: 'center',
        alignItems: 'center',
        width: 140,
        height: 140,
        margin: 30
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
