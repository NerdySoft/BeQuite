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
                <Icon style={ iconStyle } name={ icon } size={22} color='gray' />
                <Text style={ textStyle }>{ text }</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = {
    limitButton: {
        backgroundColor: 'white',
        height: 60,
        paddingHorizontal: 15,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 18,
        color: '#595959',
        marginLeft: 10
    },
    iconStyle: {
        paddingTop: 2
    },
};

export default SettingsItem;