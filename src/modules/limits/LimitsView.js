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
import * as NavigationState from '../../modules/navigation/NavigationState';
const LimitsView = React.createClass({
    getSaveLimitRoute(limit){
        this.props.dispatch(NavigationState.pushRoute({
            key: 'EditLimit',
            title: `Edit Limits`,
            data: { limit, isUpdate: true },
            showRightComponent: 'true',
            iconName: 'save',
            rightComponentAction: () => this.props.dispatch(NavigationState.popRoute())
        }));
    },
    goToEditLimits(){
        this.getSaveLimitRoute();
    },
    render() {
        const { limits } = this.props;
        return (
            <View style={styles.container}>
                {
                    limits && limits.map((limit, index) => {
                       const saveLimitRouteCover = () => this.getSaveLimitRoute(limit);

                       return (
                           <TouchableOpacity
                                onPress={ saveLimitRouteCover }
                                style={ styles.limitButton }
                                title={ `${index}` }
                                key={ `limit-${index}` }>
                                <Text style={styles.text}>{ limit.title.value }</Text>
                                <Text style={styles.decibels}>{ limit.decibels.value } DB</Text>
                            </TouchableOpacity>
                       );
                    })
                }
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
