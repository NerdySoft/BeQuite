import React, { PropTypes } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ListView,
  View
} from 'react-native';

const DecibelPickerView = React.createClass({
  propTypes: {
    setSceneParams: PropTypes.func,
    decibels: PropTypes.array.isRequired
  },
  getInitialState() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return { decibels: ds.cloneWithRows(this.props.decibels) }
  },
  componentDidMount() {
    this.props.setSceneParams({ msg: 'Hello from DECIBELS!' });
  },
  render() {
    return (
      <View style={ styles.container }>
        <ListView
            dataSource={ this.state.decibels }
            renderRow={ value =>
              <View style={{ borderWidth: 0.2, marginTop: 0, borderColor: 'gray', alignSelf: 'stretch' }}>
                <Text>{ this.props.data.toString() + value }</Text>
              </View>
            }
        />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 150,
    margin: 30
  },
  counter: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default DecibelPickerView;
