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
    componentDidMount() {
        setTimeout(() => this.props.dispatch(NavigationState.setRightComponentAction(
            () => this.props.dispatch(NavigationState.pushRoute({
                key: 'EditLimit',
                title: `Edit Limit`,
                data: { isUpdate: false },
                showRightComponent: 'true',
                iconName: 'save',
            }))
        )), 500);
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
                                <Text style={styles.decibels}>{ limit.decibels.value } Db</Text>
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
        backgroundColor: 'white',
        height: 60,
        paddingHorizontal: 15,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#595959'
    },
    decibelsValue: {
        fontSize: 15,
    }
});

export default LimitsView;
