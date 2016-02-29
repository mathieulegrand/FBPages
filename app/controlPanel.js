'use strict';

import React, { View, Text, Image } from 'react-native';
import Button from 'react-native-button';

import Login  from './login.js';

export default class ControlPanel extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.controlPanelWelcome}>
          Control Panel
        </Text>
        <Button onPress={ () => {  console.log("a"); this.props.setViewSettings({visibility: 'all'}); }}>Show unpublished posts</Button>
        <Login onLogout={ () => {  this.props.openWelcomeScreen(); }}/>
      </View>
    );
  }
}

const styles = React.StyleSheet.create({
  container: {
    marginTop: 25,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 25,
  },
  controlPanelWelcome: {
    fontSize: 20,
    paddingBottom: 20,
    fontWeight:'bold',
  },
});
