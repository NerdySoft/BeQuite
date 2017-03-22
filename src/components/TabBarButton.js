import React, {PropTypes} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

/*<Text style={{ color: 'white' }}>{this.props.text}</Text>*/
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
        <Icon name={ this.props.icon } size={22} color='#808080'/>
      </TouchableOpacity>
    );
  }
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  selected: {
    borderBottomColor: 'steelblue',
    borderBottomWidth: 5
  }
});
