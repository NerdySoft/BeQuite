import React, { PropTypes } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Button,
    Text,
    View,
    TextInput,
    NativeModules,
    NativeAppEventEmitter,
    DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { pushRoute, setRightComponentAction } from '../navigation/NavigationState';
import { saveLimit } from '../limits/LimitsState';

const EditLimtsView = React.createClass({
    goToDecibels() {
        this.props.dispatch(pushRoute({
            key: 'Decibel',
            title: `Decibels`,
            data: 'I came from Edit Limits View!',
            navigateBackAction: () => {}
        }));
    },
    getInitialState() {
        return {
            decibels: '0',
            title: '',
            message: ''
        }
    },
    componentDidMount() {
        setTimeout(() => this.props.dispatch(setRightComponentAction(
            () => this.props.dispatch(saveLimit({ title: 'BRO', text: 'TEXT', decibelsValue: 1000 }))
        )), 1000);
    },
    deleteLimit(){
        //TODO: make function that will delete limit
    },
    render() {
        const { limits, data: { isUpdate } } = this.props;

        return (
            <View style={styles.container}>
                <TextInput
                    placeholder="Title:"
                    style={styles.title} />
                <TextInput
                    style={styles.textmessage}
                    placeholder="Enter text message here:"
                    multiline = {true}
                    numberOfLines={2}
                />
                <TouchableOpacity
                    onPress={this.goToDecibels}
                    style={[styles.button, this.props.isSelected && styles.selected]}>
                    <View>
                        <Text style={styles.buttontext}>Select Sound Limit</Text>
                    </View>
                    <View style={styles.arrowAndDb}>
                        <Text style={styles.decibelsvalue}>{this.state.decibels} DB</Text>
                        <Icon name="angle-right" size={22} style={styles.arrowRight}></Icon>
                    </View>


                </TouchableOpacity>

                { isUpdate && <TouchableOpacity
                    onPress={this.deleteLimit}
                    style={[styles.bigButton, styles.deleteButton]}>
                    <Icon name="remove" size={22} style={styles.bigButtonIcon}>
                    </Icon>
                    <Text style={styles.bigButtonText}>DELETE</Text>
                    </TouchableOpacity>
                }
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    title:{
        alignSelf: 'stretch',
    },
    textmessage:{
        alignSelf: 'stretch',

    },
    arrowRight:{
        marginLeft: 5,
        bottom: 2
    },
    button:{
        paddingTop: 5,
        paddingBottom: 5,
        alignSelf: 'stretch',
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        flex: 0,
        marginTop: 18,
        marginBottom: 18

    },
    buttontext:{
        fontSize: 18,

    },
    arrowAndDb:{
        flexDirection: "row",
    },
    decibelsvalue:{

    },
    bigButton:{
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'stretch',
        marginTop: 18,
        marginBottom: 18,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent : 'center'
    },
    saveButton:{
        backgroundColor: 'rgba(58,224,29,0.7)',
    },
    deleteButton:{
        backgroundColor: 'rgba(255,0,0,0.6)',
    },
    bigButtonText:{
        marginLeft: 5,
        fontSize:14
    },
    bigButtonIcon:{

    }
});

export default EditLimtsView;
