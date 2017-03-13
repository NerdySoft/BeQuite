import {fromJS} from 'immutable';
import {NavigationExperimental} from 'react-native';
import {isNumber} from 'lodash';

const {StateUtils: NavigationStateUtils} = NavigationExperimental;

// Actions
const PUSH_ROUTE = 'NavigationState/PUSH_ROUTE';
const POP_ROUTE = 'NavigationState/POP_ROUTE';
const SWITCH_TAB = 'NavigationState/SWITCH_TAB';
const SET_PARAMS = 'NavigationState/SET_PARAMS';

export function switchTab(key) {
  return {
    type: SWITCH_TAB,
    payload: key
  };
}

// Action creators
export function pushRoute(route) {
  return {
    type: PUSH_ROUTE,
    payload: route
  };
}

export function setSceneParams(params) {
  return {
    type: SET_PARAMS,
    payload: params
  };
}

export function popRoute() {
  return {type: POP_ROUTE};
}

// reducers for tabs and scenes are separate
const initialState = fromJS({
  tabs: {
    index: 0,
    routes: [
      {key: 'HomeTab', title: 'HOME', tabIcon: 'home'},
      {key: 'ProfileTab', title: 'SETTINGS', tabIcon: 'cog'}
    ]
  },
  // Scenes for the `HomeTab` tab.
  HomeTab: {
    index: 0,
    routes: [{key: 'Amplitude', title: 'Home'}]
  },
  // Scenes for the `ProfileTab` tab.
  ProfileTab: {
    index: 0,
    routes: [{key: 'Settings', title: 'Settings'}]
  },
  DecibelScene: {
    index: 0,
    routes: [{key: 'Decibel', title: 'Decibels'}]
  },
});

export default function NavigationReducer(state = initialState, action) {
  switch (action.type) {
    case PUSH_ROUTE: {
      // Push a route into the scenes stack.
      const route = action.payload;
      const tabs = state.get('tabs');
      const tabKey = tabs.getIn(['routes', tabs.get('index')]).get('key');
      const scenes = state.get(tabKey).toJS();
      let nextScenes;
      // fixes issue #52
      // the try/catch block prevents throwing an error when the route's key pushed
      // was already present. This happens when the same route is pushed more than once.
      try {
        nextScenes = NavigationStateUtils.push(scenes, route);
      } catch (e) {
        nextScenes = scenes;
      }
      if (scenes !== nextScenes) {
        return state.set(tabKey, fromJS(nextScenes));
      }
      return state;
    }

    case POP_ROUTE: {
      // Pops a route from the scenes stack.
      const tabs = state.get('tabs');
      const tabKey = tabs.getIn(['routes', tabs.get('index')]).get('key');
      const scenes = state.get(tabKey).toJS();
      const scene = scenes.routes[scenes.routes.length - 1];

      if (scene && typeof scene.navigateBackAction === 'function') {
        const params = state.get('sceneParams');

        if (params) {
            scene.navigateBackAction(params && params.toJS());
            state.delete('sceneParams');
        }
      }

      const nextScenes = NavigationStateUtils.pop(scenes);
      if (scenes !== nextScenes) {
        return state.set(tabKey, fromJS(nextScenes));
      }
      return state;
    }

    case SWITCH_TAB: {
      // Switches the tab.
      const tabs = state.get('tabs').toJS();

      let nextTabs;
      try {
        nextTabs = isNumber(action.payload)
          ? NavigationStateUtils.jumpToIndex(tabs, action.payload)
          : NavigationStateUtils.jumpTo(tabs, action.payload);
      } catch (e) {
        nextTabs = tabs;
      }

      if (tabs !== nextTabs) {
        return state.set('tabs', fromJS(nextTabs));
      }
      return state;
    }

    case SET_PARAMS: {
      return action.payload
          ? state.set('sceneParams', fromJS(action.payload)) : state;
    }

    default:
      return state;
  }
}