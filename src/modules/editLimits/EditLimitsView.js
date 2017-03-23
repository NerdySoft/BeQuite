import React, { PropTypes } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    modalButton,
    Text,
    View,
    Alert,
    Modal,
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
    getInitialState() {
        let initialLimit = {
            limit: {
                id: generateUUID(),
                decibels: new LimitProp(0, true),
                title: new LimitProp('', true),
                message: new LimitProp('', false),
                audio: new LimitProp('', false),
                image: new LimitProp('', false)
            },
            audioModalVisible: false
        };
        const { data: { limit } } = this.props;

        if (limit) initialLimit.limit = limit;

        return initialLimit;
    },
    componentDidMount() {
        setTimeout(() => this.props.dispatch(setRightComponentAction(
            () => this.saveLimitObj()
        )), 300);
        NativeAppEventEmitter.addListener('chosenFleURI', (data) => {
            const limit = this.state.limit;

            if (data.fileType == 1) {
                this.setState({
                    limit: {
                        ...limit,
                        audio: {
                            ...limit.audio,
                            value: data.fileURI,
                            title: data.fileName
                        }
                    }
                });
            }else if(data.fileType == 2){
                this.setState({
                    limit: {
                        ...limit,
                        image: {
                            ...limit.image,
                            value: data.fileURI,
                            title: data.fileName.substring(0, data.fileName.lastIndexOf('.'))
                        }
                    }
                });
            }
        });
    },
    goToDecibels() {
        const limit = this.state.limit;

        dismissKeyboard();

        this.props.dispatch(pushRoute({
            key: 'Decibel',
            title: `Decibels`,
            data: { decibels: limit.decibels },
            navigateBackAction: data => data && this.setState({
                limit: { ...limit, decibels: { ...limit.decibels, value: data.decibels} }
            })
        }));
    },
    setModalVisible(visible) {
        this.setState({ audioModalVisible: visible });
    },
    saveLimitObj() {
        const emptyProps = [];
        const limit = this.state.limit;

        dismissKeyboard();

        for (const prop in limit) {
            if (limit.hasOwnProperty(prop)
                && limit[prop].isRequired && !limit[prop].value) {
                emptyProps.push(prop.toLocaleLowerCase());
            }
        }

        if (emptyProps.length === 0) {
            this.props.dispatch(saveLimit(limit))
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
                    const id = this.state.limit.id;
                    this.props.dispatch(removeLimit(id));
                }},
            ],
            { cancelable: false }
        );
    },
    chooseAudio() {
        AudioLevel.chooseFile(1);//1 - audio, 2 - image
        this.setModalVisible(false);
    },
    chooseImage(){
        AudioLevel.chooseFile(2);//1 - audio, 2 - image
    },
    render() {
        const { data: { isUpdate } } = this.props;
        const limit = this.state.limit;

        console.log(limit);

        return (
            <View style={ styles.container }>
                <View style={styles.labelContainer}>
                    <Text>General</Text>
                </View>
                <View style={styles.fieldContainer}>
                    <TextInput
                        placeholder="Title"
                        style={[styles.textInput, styles.fieldUnderlined]}
                        value={ limit.title.value }
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        keyboardType='default'
                        onChangeText={ value => this.setState({
                            limit: {
                                ...limit,
                                title: { ...limit.title, value }
                            }
                        })}
                    />
                    <TextInput
                        style={ styles.textInput }
                        placeholder="Message"
                        multiline = { true }
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        keyboardType='default'
                        value={ limit.message.value }
                        onChangeText={ value => this.setState({
                            limit: {
                                ...limit,
                                message: { ...limit.message, value }
                            }
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
                            <Text style={styles.decibelsValue}>{ limit.decibels.value } Db</Text>
                            <Icon name="angle-right" size={22} style={styles.arrowRight}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ () => this.setModalVisible(true) }
                        style={[ styles.button, styles.fieldUnderlined ]}>
                        <View>
                            <Text style={styles.buttonText}>{ limit.audio.title || 'Sound Alert' }</Text>
                        </View>
                        <View style={styles.arrowAndDb}>
                            <Icon name="angle-right" size={22} style={styles.arrowRight}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={ this.chooseImage }
                    style={ styles.button }>
                    <View>
                        <Text style={styles.buttonText}>{ limit.image.title || 'Image Alert' }</Text>
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

                <Modal
                    animationType={'fade'}
                    transparent={ true }
                    visible={ this.state.audioModalVisible }
                    onRequestClose={() => this.setModalVisible(false)}
                >
                    <View style={ styles.modalContainer }>
                        <View elevation={5} style={ styles.audioSelectionContainer }>
                            <TouchableOpacity
                                onPress={ this.chooseAudio }
                                style={[styles.modalButton, styles.modalButtonUnderlined]}>
                                <Text style={styles.modalButtonText}>Browse</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Record</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.4)'
    },
    audioSelectionContainer: {
        backgroundColor: 'white',
        height: 200,
        width: 300,
        borderRadius: 3,
        shadowColor: '#000000',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.8,
        flex: 0,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    modalButton: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButtonUnderlined: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    modalButtonText: {
        fontSize: 16,
        color: '#393939'
    }
});

export default EditLimtsView;
