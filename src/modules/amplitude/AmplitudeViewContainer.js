import {connect} from 'react-redux';
import CounterView from './AmplitudeView';

export default connect(
  state => ({
    amplitude: state.getIn(['amplitude', 'value']),
    loading: state.getIn(['amplitude', 'loading']),
    loaded: state.getIn(['amplitude', 'loaded']),
    intervId: state.getIn(['amplitude', 'intervId'])
  })
)(CounterView);
