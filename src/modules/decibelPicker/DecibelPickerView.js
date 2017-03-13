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
    //this.props.setSceneParams({ msg: 'Hello from DECIBELS!' });
  },
  chooseDecibels(decibels){
    this.props.setSceneParams({ msg: decibels });
    this.props.onNavigateBack();

  },
  render() {
    return (
      <View style={ styles.container }>
        <ListView
            dataSource={ this.state.decibels }
            renderRow={ value =>
            <TouchableOpacity
                onPress={() => this.chooseDecibels(value)}
                style={styles.limitButton}>
                {/*<Text>{ this.props.data.toString() + value }</Text>*/}
              <Text>{ value } db</Text>
            </TouchableOpacity>
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

export default DecibelPickerView;
