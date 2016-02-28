'use strict';

import React, { View } from 'react-native';
import Button from 'react-native-button';
import Icon   from 'react-native-vector-icons/FontAwesome';

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
      renderLeftButton() {
        return (
          <Button
            onPress={() => { console.log('Tapped right button'); }}
            containerStyle={{ height: 64, width: 64, overflow:'hidden', alignItems: 'center', flex: 1, justifyContent:'center'}}>
            <Icon name="navicon" size={24} color="#5A7EB0" />
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
