import React, {PropTypes} from 'react';
import { addLimit } from '../limits/LimitsState'
import {
    Text,
    View,
    StyleSheet
} from 'react-native';

import * as NavigationState from '../../modules/navigation/NavigationState';

const color = () => Math.floor(255 * Math.random());

/**
 * Sample view to demonstrate navigation patterns.
 * @TODO remove this module in a live application.
 */
const ColorView = React.createClass({
    propTypes: {
        dispatch: PropTypes.func.isRequired,
    },
    getInitialState() {
        return {text: 'Tap me for going to "DECIBELS-VIEW"'}
    },
    goToDecibels() {
        this.props.dispatch(NavigationState.pushRoute({
            key: 'Decibel',
            title: `Decibels`,
            data: 'I came from Settings!',
            navigateBackAction: data => this.setState({text: data.msg}),
        }));
    },
    goToEditLimits(){
        this.props.dispatch(NavigationState.pushRoute({key: 'EditLimit', title: `Edit Limits`, data: 'I came from Settings!'}));
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
                data: 'I came from Settings!',
                showRightComponent: 'true',
                iconName: 'save',
                //rightComponentAction for save button
                rightComponentAction: ()=>this.props.dispatch(NavigationState.popRoute())
            }, { title: 'NEW LIMIT23', decibelsValue: 1000, text: 'some text' }))
        }));
    },
    render() {
        const index = this.props.index;

        return (
            <View style={[styles.container]}>
                <Text onPress={this.goToDecibels}>
                    { this.state.text }
                </Text>
                <Text onPress={this.goToEditLimits}>
                    { 'Tap me for going to "EDIT-LIMITS"' }
                </Text>
                <Text onPress={this.goToLimits}>
                    { 'Tap me for going to "Limits"' }
                </Text>
            </View>
        );
    }
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ColorView;
