import React, { PropTypes } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Slider
} from 'react-native';
import * as NavigationState from '../../modules/navigation/NavigationState';
import { changeCorrection } from '../amplitude/AmplitudeState';
import { popRoute, setRightComponentAction } from '../navigation/NavigationState';
const MicrophoneCalibrationView = React.createClass({
    componentDidMount(){
        setTimeout(() => this.props.dispatch(setRightComponentAction(
            () => {
                this.saveCorrection();
                this.props.dispatch(NavigationState.popRoute());
            }
        )), 300);
    },
    saveCorrection(){
        this.props.dispatch(changeCorrection(this.state.correctionValue));
    },
    getInitialState(){
        return{
            correctionValue: this.props.correction,
        };
    },
    render() {
        //const { limits } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.text} >
                    Correction: {this.state.correctionValue && +this.state.correctionValue.toFixed(3)} db.
                </Text>
                <Slider
                    value={this.state.correctionValue}
                    style={styles.slider}
                    minimumValue={-20}
                    maximumValue={30}
                    onValueChange={(correctionValue) => this.setState({correctionValue: correctionValue})} />
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
    decibelsValue: {
        paddingLeft: 10,
        fontSize: 15,
    },
    correctButtons:{

    },
    slider: {

        height: 30,
        margin: 10,
    },
    text: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '500',
        margin: 10,
    },
});

export default MicrophoneCalibrationView;
