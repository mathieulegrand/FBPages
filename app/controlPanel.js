'use strict';

import React, { View, Text, Image, TouchableOpacity } from 'react-native';

import Login  from './login';

export default class ControlPanel extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.controlPanelWelcome}>
          Control Panel
        </Text>
        <TouchableOpacity onPress={ () => {  console.log("a"); }} style={ styles.buttonContainer }>
          <Text>Show unpublished posts</Text>
        </TouchableOpacity>
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
  buttonContainer: {
    margin: 10,
  },
  controlPanelWelcome: {
    fontSize: 20,
    paddingBottom: 20,
    fontWeight:'bold',
  },
});
