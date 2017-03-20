import React from 'react';
import {
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const SettingsItem = (props)=>{
    const {onPress, keyProp, icon, text} = props;
    const {limitButton, textStyle, iconStyle} = styles;
    return(
        <TouchableOpacity onPress={ onPress } style={ limitButton } key={ keyProp }>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Icon style={ iconStyle } name={ icon } size={20} color='steelblue' />
                <Text style={ textStyle }>{ text }</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = {
    limitButton: {
        alignSelf: 'stretch',
        height: 70,
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    textStyle: {
        paddingLeft: 10,
        paddingTop: 20,
        fontSize: 20
    },
    iconStyle: {
        paddingTop: 25
    },
    decibelsValue: {
        paddingLeft: 10,
        fontSize: 15,
    }
};

export default SettingsItem;