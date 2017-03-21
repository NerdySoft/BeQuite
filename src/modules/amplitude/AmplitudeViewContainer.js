import {connect} from 'react-redux';
import CounterView from './AmplitudeView';

export default connect(
  state => ({
    amplitude: state.getIn(['amplitude', 'value']),
    loading: state.getIn(['amplitude', 'loading']),
    loaded: state.getIn(['amplitude', 'loaded']),
    intervId: state.getIn(['amplitude', 'intervId']),
    limits: state.getIn(['limits']).toJS(),
    correction: state.getIn(['amplitude', 'correction'])
  })
)(CounterView);
