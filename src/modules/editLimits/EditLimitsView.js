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
            data: { decibels: this.state.decibels },
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
            image: new LimitProp('', false)
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
                emptyProps.push(prop.toLocaleLowerCase());
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
                <View style={styles.labelContainer}>
                    <Text>General</Text>
                </View>
                <View style={styles.fieldContainer}>
                    <TextInput
                        placeholder="Title"
                        style={[styles.textInput, styles.fieldUnderlined]}
                        value={ this.state.title.value }
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        keyboardType='default'
                        onChangeText={ value => this.setState({
                            title: { ...this.state.title, value }
                        })}
                    />
                    <TextInput
                        style={ styles.textInput }
                        placeholder="Message"
                        multiline = { true }
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        keyboardType='default'
                        value={ this.state.message.value }
                        onChangeText={ value => this.setState({
                            message: { ...this.state.message, value }
                        })}
                    />
                </View>
                <View style={styles.labelContainer}>
                    <Text>Options</Text>
                </View>
                <View style={styles.fieldContainer}>
                    <TouchableOpacity
                        onPress={ this.goToDecibels }
                        style={[styles.button, styles.fieldUnderlined]}>
                        <View>
                            <Text style={styles.buttonText}>Sound Limit</Text>
                        </View>
                        <View style={styles.arrowAndDb}>
                            <Text style={styles.decibelsValue}>{ this.state.decibels.value } Db</Text>
                            <Icon name="angle-right" size={22} style={styles.arrowRight}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ this.chooseAudio }
                        style={[ styles.button, styles.fieldUnderlined ]}>
                        <View>
                            <Text style={styles.buttonText}>{ this.state.audio.title || 'Sound Alert' }</Text>
                        </View>
                        <View style={styles.arrowAndDb}>
                            <Icon name="angle-right" size={22} style={styles.arrowRight}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={ this.chooseImage }
                    style={ styles.button }>
                    <View>
                        <Text style={styles.buttonText}>{ this.state.image.title || 'Image Alert' }</Text>
                    </View>
                    <View style={styles.arrowAndDb}>
                        <Icon name="angle-right" size={22} style={styles.arrowRight}/>
                    </View>
                </TouchableOpacity>
                </View>

                { isUpdate &&
                <View style={[styles.fieldContainer, styles.margin]}>
                    <TouchableOpacity
                        onPress={this.removeLimitObj}
                        style={[styles.deleteButton, styles.deleteButton]}>
                        <Icon name="remove" size={22} color="red"/>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                }
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    margin: {
        marginTop: 40
    },
    labelContainer: {
        paddingLeft: 15,
        height: 40,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: 'center',
    },
    fieldContainer: {
        alignSelf: 'stretch',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'lightgray',
        paddingLeft: 15
    },
    textInput:{
        height: 40,
        color: '#393939',
    },
    fieldUnderlined: {
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray'
    },
    arrowRight:{
        marginRight: 8,
        marginLeft: 5,
        bottom: 2
    },
    button:{
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: 'center',
        height: 40
    },
    buttonText:{
        fontSize: 14,
        color: '#393939',
    },
    arrowAndDb:{
        flexDirection: "row",
    },
    decibelsValue:{
        marginRight: 4
    },
    deleteButton:{
        height: 40,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent : 'center'
    },
    saveButton:{
        backgroundColor: 'rgba(58,224,29,0.7)',
    },
    deleteButtonText:{
        marginLeft: 5,
        fontSize:14,
        color: 'red'
    }
});

export default EditLimtsView;
