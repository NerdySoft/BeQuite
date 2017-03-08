import React, {PropTypes} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default React.createClass({
  displayName: 'TabBarButton',
  propTypes: {
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired
  },
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.action}
        style={[styles.button, this.props.isSelected && styles.selected]}>
        <Icon name={ this.props.icon } size={20} color='white' /><Text style={{ color: 'white' }}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#969696',
  },
  selected: {
    backgroundColor: '#6d6d6d'
  }
});
