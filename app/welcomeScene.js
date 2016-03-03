'use strict';

import React, { View, Text } from 'react-native';

import Login  from './login';
import { Router } from './router'

export default class WelcomeScene extends React.Component {
  render() {
    const { login } = this.props
    console.log("Welcome", login);
    return (
      <View style={styles.firstView}>
        <Text style={styles.welcome}>
          Welcome to{'\n'}
          Pages Manager
        </Text>
        <Login style={styles.login}
               onLoginFailure={  () => { this.props.onLoginSuccess();  } }
               onLogoutSuccess={ () => { this.props.onLogoutSuccess(); } }
               onLoginSuccess={  () => { this.props.onLoginSuccess();  } }
               publishPermissions={ [ 'manage_pages' ] }
        />
        <Text style={styles.instructions}>
          Connect to post updates to your Facebook Pages and
          see the number of people that have viewed your posts.
        </Text>
      </View>
    );
  }
}

WelcomeScene.propTypes = {
  onLoginFailure:     React.PropTypes.func.isRequired,
  onLoginSuccess:     React.PropTypes.func.isRequired,
  onLogoutSuccess:    React.PropTypes.func.isRequired,
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
