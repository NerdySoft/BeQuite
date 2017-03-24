import { connect } from 'react-redux';
import SettingsView from './SettingsView';

export default connect(state => ({
    settings: state.get('settings').toJS()
}))(SettingsView);