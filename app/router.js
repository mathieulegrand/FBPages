'use strict';

import React, { View } from 'react-native';
import Button from 'react-native-button';
import Icon   from 'react-native-vector-icons/Ionicons';

import HomeScene    from './homeScene.js';
import PostScene    from './postScene.js';
import WelcomeScene from './welcomeScene.js';

let Router = {
  getHomeRoute(profile) {
    return {
      renderScene()  {
        return <HomeScene visibilityProfile={profile.visibility}/>;
      },
      getTitle() {
        return 'Page';
      },
      hideNavBar: false,
      renderLeftButton(navigator, index, state) {
        return (
          <Button
            onPress={() => {
              let props = navigator.props;
              if (typeof props.openDrawer === 'function') { props.openDrawer(); }
            }}
            containerStyle={styles.leftButtonContainer}>
            <Icon name="navicon-round" size={24} color="#5A7EB0" />
          </Button>
        );
      },
    };
  },

  getPostRoute() {
    return {
      getSceneClass() {
        return PostScene;
      },
      getTitle() {
        return 'New Post';
      },
      hideNavBar: false,
      renderLeftButton(navigator, index, state) {
        return (
          <Button onPress={() => { typeof navigator.props.gotoDefaultTab === 'function' ? navigator.props.gotoDefaultTab() : null } }
                  containerStyle={styles.leftButtonContainer}
                  style={styles.button}>
            Cancel
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

const styles = React.StyleSheet.create({
  leftButtonContainer: {
    height: 64,
    width: 64,
    overflow:'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent:'center'
  },
  button: {
    fontFamily: 'System',
    fontWeight: '400',
  },
});

