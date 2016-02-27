/**
 * Application for the management of a Facebook Page.
 *
 * Features:
 * - create regular or unpublished posts to a Facebook Page
 * - able to list posts (published and/or unpublished)
 * - show the number of people who have viewed each post
 *
 * Author: Mathieu Legrand <mathieu@legrand.im>.
 *
**/
'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

var Login = require('./app/components/login.ios.js');

class Application extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to{'\n'}
          Pages Manager
        </Text>
        <Login style={styles.login}/>
        <Text style={styles.instructions}>
          Connect to post updates to your Facebook Pages and
          see the number of people that have viewed your posts.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  welcome: {
    fontSize: 36,
    color: "#5A7EB0",
    fontWeight: "200",
    textAlign: 'center',
    marginTop: 80,
  },
  login: {
    margin: 10,
  },
  instructions: {
    fontSize: 15,
    color: "#989898",
    fontWeight: "400",
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
  }
});

AppRegistry.registerComponent('FBPages', () => Application);
