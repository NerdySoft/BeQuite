import React, { PropTypes } from 'react';
import {
    Text,
    View,
    Slider,
    StyleSheet,
} from 'react-native';
import { setRightComponentAction } from '../navigation/NavigationState';
import { saveSettings } from './SettingsState';

const SettingsView = React.createClass({
    propTypes: {
        settings: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
    },
    getInitialState() {
        return { ...this.props.settings };
    },
    componentDidMount() {
        setTimeout(() => this.props.dispatch(setRightComponentAction(
            () => this.props.dispatch(saveSettings(this.state))
        )), 500);
    },
    saveSettings(){

    },
    render() {

        return (
            <View style={styles.container}>
                <View style={[styles.sliderBlock, styles.borderBottom]}>
                    <View style={styles.block}>
                        <Text style={styles.title}>Correction</Text>
                        <Text style={styles.value}>{ parseInt(this.state.correction).toFixed() } Db</Text>
                    </View>
                    <Slider
                        value={this.state.correction}
                        style={styles.slider}
                        minimumValue={-10}
                        maximumValue={10}
                        onValueChange={correction => this.setState({correction})}
                    />
                </View>
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    block: {
        flex: 0,
        backgroundColor: 'white',
        height: 50,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',

    },
    borderBottom: {
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
    },
    sliderBlock: {
        height: 80,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 16,
        color: '#595959'
    }
});

export default SettingsView;
