import React, { PropTypes } from 'react';
import {
    Text,
    View,
    Slider,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { setRightComponentAction } from '../navigation/NavigationState';
import NumberPickerDialog from 'react-native-numberpicker-dialog';
import { saveSettings } from './SettingsState';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        NumberPickerDialog.show({
            values: ['First item', 'Second item', 'Third item'],
            positiveButtonLabel: 'Ok',
            negativeButtonLabel: 'Cancel',
            message: 'What would you like to have?',
            title: 'Nice dialog',
        }).then((id) => {
            // id is the index of the chosen item, or -1 if the user cancelled.
            console.log(id);
        });
    },
    render() {
        const {
            timeOfInitialCollect,
            correction,
            maxCountOfAlerts,
            timeOfDangerCollect
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text>General</Text>
                </View>
                <TouchableOpacity style={[styles.block, styles.borderTop, styles.borderBottom]} onPress={this.saveSettings}>
                    <Text style={styles.title}>Time of Collecting</Text>
                    <View style={styles.iconContainer}>
                        <Text style={styles.value}>{ timeOfInitialCollect } Sec</Text>
                        <Icon  style={styles.icon} name="angle-right" size={22}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.block, styles.borderBottom]} onPress={this.saveSettings}>
                    <Text style={styles.title}>Count of Alerts</Text>
                    <View style={styles.iconContainer}>
                        <Text style={styles.value}>{ maxCountOfAlerts } Times</Text>
                        <Icon  style={styles.icon} name="angle-right" size={22}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.block, styles.borderBottom]} onPress={this.saveSettings}>
                    <Text style={styles.title}>Time of Warning Listening</Text>
                    <View style={styles.iconContainer}>
                        <Text style={styles.value}>{ timeOfDangerCollect } Sec</Text>
                        <Icon  style={styles.icon} name="angle-right" size={22}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.labelContainer}>
                    <Text>Correction</Text>
                </View>
                <View style={[styles.sliderBlock, styles.borderBottom, styles.borderTop]}>
                    <View style={styles.block}>
                        <Text style={styles.title}>Correction</Text>
                        <Text style={styles.value}>{ parseInt(correction).toFixed() } Db</Text>
                    </View>
                    <Slider
                        value={correction}
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
    labelContainer: {
        paddingLeft: 15,
        height: 50,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: 'center',
    },
    marginTop: {
        marginTop: 50
    },
    borderTop: {
        borderTopColor: 'lightgray',
        borderTopWidth: 1,
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
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 5
    }
});

export default SettingsView;
