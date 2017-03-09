import React, {PropTypes} from 'react';
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
    return { text: 'Tap me for going to "DECIBELS-VIEW"' }
  },
  goToDecibels() {
    this.props.dispatch(NavigationState.pushRoute({
      key: 'Decibel',
      title: `Decibels`,
      data: 'I came from Settings!',
      navigateBackAction: data => this.setState({ text: data.msg })
    }));
  },
  render() {
    return (
      <View style={[styles.container]}>
        <Text onPress={this.goToDecibels}>
          { this.state.text }
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
