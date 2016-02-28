// The welcome / sign-in page

'use strict';

import React, { StyleSheet, Text, View } from 'react-native';

import Login from './login.ios.js';

export default class Launch extends React.Component {
  render() {
    return (
      <View style={styles.firstView}>
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
  firstView: {
    flex: 1,
    justifyContent: 'space-between',
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
