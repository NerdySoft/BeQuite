import React, { PropTypes } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Button,
    Text,
    View,
    Alert,
    TextInput,
    NativeModules,
    NativeAppEventEmitter,
    DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
//import dismissKeyboard from 'react-native-dismiss-keyboard';
import { generateUUID, LimitProp } from '../../services/mainService';
import { pushRoute, setRightComponentAction } from '../navigation/NavigationState';
import { saveLimit, removeLimit } from '../limits/LimitsState';

const AudioLevel  = NativeModules.AudioLevel;
const dismissKeyboard = require('dismissKeyboard');

const EditLimtsView = React.createClass({
    goToDecibels() {
        dismissKeyboard();
        this.props.dispatch(pushRoute({
            key: 'Decibel',
            title: `Decibels`,
            navigateBackAction: data => data && this.setState({
                decibels: { ...this.state.decibels, value: data.decibels}
            })
        }));
    },
    getInitialState() {
        let initialLimit = {
            id: generateUUID(),
            decibels: new LimitProp(0, true),
            title: new LimitProp('', true),
            message: new LimitProp('', false),
            audio: new LimitProp('', false),
            image: new LimitProp('', true)
        };
        const { data: { limit } } = this.props;

        if (limit) initialLimit = limit;

        return initialLimit;
    },
    componentDidMount() {
        setTimeout(() => this.props.dispatch(setRightComponentAction(
            () => this.saveLimitObj()
        )), 300);
        NativeAppEventEmitter.addListener('chosenFleURI', (data) => {
            if(data.fileType == 1){
                this.setState({ audio: {
                    ...this.state.audio,
                    value: data.fileURI,
                    title: data.fileName
                }});
            }else if(data.fileType == 2){
                console.log('Here');
                this.setState({ image: {
                    ...this.state.image,
                    value: data.fileURI,
                    title: data.fileName.substring(0, data.fileName.lastIndexOf('.'))
                }});
            }
        });
    },
    saveLimitObj() {
        const emptyProps = [];

        dismissKeyboard();

        for (const prop in this.state) {
            if (this.state.hasOwnProperty(prop)
                && this.state[prop].isRequired && !this.state[prop].value) {
                emptyProps.push(prop.toLocaleUpperCase());
            }
        }

        if (emptyProps.length === 0) {
            this.props.dispatch(saveLimit(this.state))
        } else {
            const message = `${ emptyProps.join(', ') } ${ emptyProps.length > 1 ? 'need' : 'needs' } to be filled`;
            Alert.alert(
                null,
                message,
                [{ text: 'OK' }],
                { cancelable: false }
            );
        }
    },
    removeLimitObj() {
        Alert.alert(
            null,
            'Do you really want to delete limit?',
            [
                { text: 'Cancel' },
                { text: 'OK', onPress: () => {
                    const id = this.state.id;
                    this.props.dispatch(removeLimit(id));
                }},
            ],
            { cancelable: false }
        );
    },
    chooseAudio() {
        AudioLevel.chooseFile(1);//1 - audio, 2 - image
    },
    chooseImage(){
        AudioLevel.chooseFile(2);//1 - audio, 2 - image
    },
    render() {
        const { data: { isUpdate } } = this.props;

        return (
            <View style={ styles.container }>
                <TextInput
                    placeholder="Title"
                    style={ styles.title }
                    value={ this.state.title.value }
                    onChangeText={ value => this.setState({
                        title: { ...this.state.title, value }
                    })}
                />
                <TextInput
                    style={ styles.textmessage }
                    placeholder="Message"
                    multiline = { true }
                    value={ this.state.message.value }
                    onChangeText={ value => this.setState({
                        message: { ...this.state.message, value }
                    })}
                />
                <TouchableOpacity
                    onPress={ this.goToDecibels }
                    style={[styles.button, this.props.isSelected && styles.selected]}>
                    <View>
                        <Text style={styles.buttontext}>Sound Limit</Text>
                    </View>
                    <View style={styles.arrowAndDb}>
                        <Text style={styles.decibelsvalue}>{ this.state.decibels.value } DB</Text>
                        <Icon name="angle-right" size={22} style={styles.arrowRight}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ this.chooseAudio }
                    style={ styles.button }>
                    <View>
                        <Text style={styles.buttontext}>{ this.state.audio.title || 'Sound Alert' }</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ this.chooseImage }
                    style={ styles.button }>
                    <View>
                        <Text style={styles.buttontext}>{ this.state.image.title || 'Test' }</Text>
                    </View>
                </TouchableOpacity>

                { isUpdate && <TouchableOpacity
                    onPress={this.removeLimitObj}
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
