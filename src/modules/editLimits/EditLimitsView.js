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
import * as NavigationState from '../../modules/navigation/NavigationState';

const EditLimtsView = React.createClass({
    goToDecibels() {
        this.props.dispatch(NavigationState.pushRoute({ key: 'Decibel', title: `Decibels`}));
    },
    deleteLimit(){
        //TODO: make function that will delete limit
    },
    render() {
        const { limits } = this.props;

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
                        <Text style={styles.decibelsvalue}>500 DB</Text>
                        <Icon name="angle-right" size={22} style={styles.arrowRight}></Icon>
                    </View>


                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.deleteLimit}
                    style={styles.deleteButton}>
                    <Icon name="remove" size={22} style={styles.deleteIcon}>
                    </Icon>
                    <Text style={styles.deleteText}>DELETE</Text>

                </TouchableOpacity>
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
    deleteButton:{
        paddingTop: 10,
        paddingBottom: 10,
        alignSelf: 'stretch',
        marginTop: 18,
        marginBottom: 18,
        alignItems: 'center',
        backgroundColor: 'rgba(255,0,0,0.6)',
        flexDirection: "row",
        justifyContent : 'center'
    },
    deleteText:{
        marginLeft: 5,
        fontSize:14
    },
    deleteIcon:{

    }
});

export default EditLimtsView;
