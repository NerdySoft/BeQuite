import React, {PropTypes} from 'react';
import {
    NavigationExperimental,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
const {
    CardStack: NavigationCardStack,
    Header: NavigationHeader,
    PropTypes: NavigationPropTypes
} = NavigationExperimental;
import AppRouter from '../AppRouter';
import TabBar from '../../components/TabBar';
import {
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Customize bottom tab bar height here if desired
const TAB_BAR_HEIGHT = 50;

const NavigationView = React.createClass({
    propTypes: {
        onNavigateBack: PropTypes.func.isRequired,
        onNavigateCompleted: PropTypes.func.isRequired,
        navigationState: PropTypes.shape({
            tabs: PropTypes.shape({
                routes: PropTypes.arrayOf(PropTypes.shape({
                    key: PropTypes.string.isRequired,
                    title: PropTypes.string.isRequired
                })).isRequired
            }).isRequired,
            HomeTab: NavigationPropTypes.navigationState.isRequired,
            ProfileTab: NavigationPropTypes.navigationState.isRequired
        }),
        switchTab: PropTypes.func.isRequired,
        pushRoute: PropTypes.func.isRequired
    },
    // NavigationHeader accepts a prop style
    // NavigationHeader.title accepts a prop textStyle
    renderHeader(sceneProps) {
        return (
            <NavigationHeader
                {...sceneProps}
                onNavigateBack={this.props.onNavigateBack}
                style={styles.navigation}
                renderTitleComponent={() => {
          return (
            <NavigationHeader.Title textStyle={styles.navigationTitle}>
              {sceneProps.scene.route.title}
            </NavigationHeader.Title>
          );
        }}
                renderRightComponent={() => {
         return (
             <TouchableOpacity onPress={sceneProps.scene.route.rightComponentAction}>
             <Icon name="plus" size={40} ></Icon>
             </TouchableOpacity>
         );
       }}
            />
        );
    },
    renderScene(sceneProps) {
        // render scene and apply padding to cover
        // for app bar and navigation bar
        return (
            <View style={styles.sceneContainer}>
                {AppRouter(sceneProps)}
            </View>
        );
    },
    render() {
        const {tabs} = this.props.navigationState;
        const tabKey = tabs.routes[tabs.index].key;
        const scenes = this.props.navigationState[tabKey];

        return (
            <View style={styles.container}>
                <NavigationCardStack
                    key={'stack_' + tabKey}
                    onNavigateBack={this.props.onNavigateBack}
                    navigationState={scenes}
                    renderHeader={this.renderHeader}
                    renderScene={this.renderScene}
                />
                <TabBar
                    height={TAB_BAR_HEIGHT}
                    tabs={tabs}
                    currentTabIndex={tabs.index}
                    switchTab={this.props.switchTab}
                />
            </View>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    navigation: {
        backgroundColor: 'steelblue',
    },
    navigationTitle: {
        color: 'white'
    },
    sceneContainer: {
        flex: 1,
        marginBottom: TAB_BAR_HEIGHT
    }
});

export default NavigationView;
