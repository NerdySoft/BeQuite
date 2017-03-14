import React, { PropTypes } from 'react';
import { addLimit } from '../limits/LimitsState'
import {
    Text,
    View,
    StyleSheet,
    ListView,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as NavigationState from '../../modules/navigation/NavigationState';

const SettingsView = React.createClass({
    propTypes: {
        dispatch: PropTypes.func.isRequired,
    },
    goToLimits() {
        this.props.dispatch(NavigationState.pushRoute({
            key: 'Limits',
            title: `Limits`,
            data: 'I came from Settings!',
            showRightComponent: 'true',
            iconName: 'plus',
            //rightComponentAction for plus button
            rightComponentAction: () => this.props.dispatch(addLimit({
                key: 'EditLimit',
                title: `Edit Limits`,
                data: 'I came from LimitView!',
                showRightComponent: 'true',
                iconName: 'save',
                //rightComponentAction for save button
                rightComponentAction: ()=>this.props.dispatch(NavigationState.popRoute())
            }, { title: 'NEW LIMIT23', decibelsValue: 1000, text: 'some text' }))
        }));
    },
    render() {
        return (
            <View style={ [styles.container] }>
                <TouchableOpacity onPress={ this.goToLimits } style={ styles.limitButton } key={ 'limits' }>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Icon style={ styles.icon } name="volume-down" size={20} color='steelblue' />
                        <Text style={ styles.text }>Limits</Text>
                    </View>
                </TouchableOpacity>
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
        paddingTop: 20,
        fontSize: 20
    },
    icon: {
        paddingTop: 25
    },
    decibelsValue: {
        paddingLeft: 10,
        fontSize: 15,
    }
});

export default SettingsView;
