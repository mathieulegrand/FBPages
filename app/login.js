// Facebook Login component

'use strict';

import React, { StyleSheet, View } from 'react-native';

import FBSDKCore,  { FBSDKAccessToken } from 'react-native-fbsdkcore';
import FBSDKLogin, { FBSDKLoginButton, FBSDKLoginManager } from 'react-native-fbsdklogin';

import { Router } from './router.js';

export default class Login extends React.Component {
  componentWillMount() {
    FBSDKAccessToken.getCurrentAccessToken((token) => {
      if (token && typeof this.props.onLoggedIn === 'function') {
        // we already are logged in, invoke the special action if defined
        this.props.onLoggedIn();
      }
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        <FBSDKLoginButton
          style={styles.loginButton}
          onLoginFinished={(error, result) => {
            if (error) {
              alert('Error while logging in.');
              console.log(error);
            } else {
              if (result.isCancelled) {
                alert('Login cancelled.');
              } else if (typeof this.props.onLogin === 'function') {
                this.props.onLogin();
              }
            }
          }}
          onLogoutFinished={() => {
            if (typeof this.props.onLogout === 'function') {
              this.props.onLogout();
            }
          }}
          readPermissions={[ ]}
          publishPermissions={[ 'manage_pages' ]}/>
      </View>
    );
  }
}

const styles = React.StyleSheet.create({
  loginButton: {
    width: 200,
    height: 50,
  },
});
