'use strict';

import React, { View } from 'react-native';
import Button from 'react-native-button';
import Icon   from 'react-native-vector-icons/Ionicons';

import HomeScene    from './homeScene.js';
import WelcomeScene from './welcomeScene.js';

let Router = {
  getHomeRoute() {
    return {
      getSceneClass() {
        return HomeScene;
      },
      getTitle() {
        return 'Page';
      },
      hideNavBar: false,
      renderLeftButton(navigator, index, state) {
        console.log("Left", navigator, index, state);
        return (
          <Button
            onPress={() => {
              let props = navigator.props;
              if (typeof props.openDrawer === 'function') { props.openDrawer(); }
            }}
            containerStyle={{ height: 64, width: 64, overflow:'hidden', alignItems: 'center', flex: 1, justifyContent:'center'}}>
            <Icon name="navicon-round" size={24} color="#5A7EB0" />
          </Button>
        );
      },
    };
  },

  getWelcomeRoute() {
    return {
      getSceneClass() {
        return WelcomeScene;
      },
      getTitle() {
        return 'Welcome';
      },
      hideNavBar: true,
    };
  },
};

export { Router };
