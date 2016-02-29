'use strict';

import React, { View, Text } from 'react-native';

import Login  from './login.js';
import { Router } from './router.js'

export default class WelcomeScene extends React.Component {
  render() {
    return (
      <View style={styles.firstView}>
        <Text style={styles.welcome}>
          Welcome to{'\n'}
          Pages Manager
        </Text>
        <Login style={styles.login}
               onLogin={    () => { this.props.closeWelcomeScreen();    } }
               onLogout={   () => { this.props.openWelcomeScreen(); } }
               onLoggedIn={ () => { this.props.closeWelcomeScreen();    } }
        />
        <Text style={styles.instructions}>
          Connect to post updates to your Facebook Pages and
          see the number of people that have viewed your posts.
        </Text>
      </View>
    );
  }
}

const styles = React.StyleSheet.create({
  firstView: {
    flex: 1,
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  welcome: {
    fontSize: 36,
    color: "#5A7EB0",
    fontWeight: "200",
    textAlign: 'center',
    marginTop: 120,
    marginBottom: 10,
  },
  login: {
    margin: 10,
    alignItems: 'center',
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
