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

const EditLimtsView = React.createClass({
    render() {
        const { limits } = this.props;

        return (
            <View style={styles.container}>
                <TextInput style={styles.title} />
                <TouchableOpacity

                    style={[styles.button, this.props.isSelected && styles.selected]}>
                    <Text>Select Limit <Icon name="arrow-right" style={styles.icon}>
                    </Icon></Text>

                </TouchableOpacity>

                <TextInput
                    style={styles.textmessage}
                    multiline = {true}
                    numberOfLines={4}
                />
                <Text>This is spaartaaaa!!!</Text>

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
        justifyContent: 'space-around',
        width: 150,
        margin: 30
    },
    counter: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    title:{
        alignSelf: 'stretch',
    },
    textmessage:{
        alignSelf: 'stretch',
    },
    icon:{

    }
});

export default EditLimtsView;
