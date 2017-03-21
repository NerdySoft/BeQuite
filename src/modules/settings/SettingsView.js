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
                        <Icon style={ styles.icon } name="volume-down" size={22} color='gray' />
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
        backgroundColor: 'white',
        height: 60,
        paddingHorizontal: 15,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#595959',
        marginLeft: 10
    },
    icon: {
        paddingTop: 2
    },
});

export default SettingsView;
