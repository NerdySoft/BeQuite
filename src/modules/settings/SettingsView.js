import React, { PropTypes } from 'react';

import {
    Text,
    View,
    StyleSheet,
    ListView,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { saveLimit } from '../limits/LimitsState'
import { pushRoute } from '../navigation/NavigationState';

const SettingsView = React.createClass({
    propTypes: {
        dispatch: PropTypes.func.isRequired,
    },
    goToLimits() {
        this.props.dispatch(pushRoute({
            key: 'Limits',
            title: `Limits`,
            showRightComponent: 'true',
            iconName: 'plus',
            // rightComponentAction for plus button
            rightComponentAction: () => this.props.dispatch(pushRoute({
                key: 'EditLimit',
                title: `Edit Limit`,
                data: { isUpdate: false },
                showRightComponent: 'true',
                iconName: 'save',
            }))
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
