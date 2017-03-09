import React, { PropTypes } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Button,
    Text,
    View,
    NativeModules,
    Card
} from 'react-native';

const LimitsView = React.createClass({
    render() {
        const { limits } = this.props;

        return (
            <View style={styles.container}>
                { limits.map((value, index) => <TouchableOpacity style={styles.limitButton} title={ `${index}` } key={ `limit-${index}` }>
                    <Text style={styles.text}>{ value.title }</Text>
                    <Text style={styles.decibelsValue}>{ value.decibelsValue } db</Text>
                </TouchableOpacity>) }
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
    text: {
        paddingLeft: 10,
        fontSize: 20
    },
    decibelsValue: {
        paddingLeft: 10,
        fontSize: 15,
    }
});

export default LimitsView;
