import React from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
    Animated,
    Easing
} from 'react-native';
const ScaledButton = React.createClass({
    getInitialState(){
        return {
            animatedValue: new Animated.Value(0),
            showPlay: true
        }
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
    statics: {
        animateButton: (from, to, once)=>{
            this.startButtonAnimation(from, to, once);
        }
    },
    componentDidMount(){
        this.props.init(this.startButtonAnimation);
    },
    render(){
        const buttonSize = this.state.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [120, 130, 0]
        });
        const {onPress, iconState1, iconState2} = this.props;
        return(
            <View style={styles.btnsContainer}>
                <TouchableWithoutFeedback
                    onPress={()=> {onPress();  this.startButtonAnimation(0, 1)}}
                >
                    <Animated.Image
                        style={[{width: buttonSize || 120, height: buttonSize || 120}]}
                        source={
                            this.state.showPlay ?
                                iconState1 :
                                iconState2
                        }>
                    </Animated.Image>
                </TouchableWithoutFeedback>

            </View>
        )
    }
});

const styles = StyleSheet.create({
    btnsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 140,
        height: 140,
        margin: 30
    },

});

export default ScaledButton;