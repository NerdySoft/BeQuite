import React, { PropTypes } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ListView,
  View,
  TimePickerAndroid
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const DecibelPickerView = React.createClass({
  propTypes: {
    setSceneParams: PropTypes.func.isRequired,
    decibels: PropTypes.array.isRequired,
    data: PropTypes.object
  },
  getInitialState() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return { decibels: ds.cloneWithRows(this.props.decibels) }
  },
  chooseDecibels(decibels){
    this.props.setSceneParams({ decibels });
    this.props.onNavigateBack();
  },
  render() {
    const { data: { decibels }} = this.props;

    return (
      <View style={ styles.container }>
          <View style={ styles.decibelsContainer }>
            <ListView
                dataSource={ this.state.decibels }
                renderRow={value =>
                <TouchableOpacity
                    onPress={() => this.chooseDecibels(value)}
                    style={styles.limitButton}>
                    <View style={styles.decibelRow}>
                        <Text>{ value }</Text>
                        { decibels && decibels.value === value &&
                            <Icon style={styles.decibelCheckedIcon} name="check" size={25}/>
                        }
                    </View>
                </TouchableOpacity>
                }
            />
          </View>
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
      height: 40,
      borderBottomColor: 'lightgray',
      borderBottomWidth: 1,
      justifyContent: 'center'
  },
  text: {
      paddingLeft: 10,
      fontSize: 20
  },
  decibelsContainer: {
      backgroundColor: 'white',
      paddingLeft: 15
  },
  decibelsValue: {
      paddingLeft: 10,
      fontSize: 15,
  },
    decibelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    decibelCheckedIcon: {
        marginRight: 10
    }
});

export default DecibelPickerView;
