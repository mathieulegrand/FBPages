// Facebook Login component

'use strict';

import React, { StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

import FBSDKCore,  { FBSDKAccessToken } from 'react-native-fbsdkcore';
import FBSDKLogin, { FBSDKLoginButton, FBSDKLoginManager } from 'react-native-fbsdklogin';

export default class Login extends React.Component {
  render() {
    FBSDKAccessToken.getCurrentAccessToken((token) => {
      if (token) {
        let currentRoute = Actions.currentRouter.currentRoute;
        if (currentRoute && currentRoute.name === "launch") {
          // we are logged in, and on the launch screen, go to the "home" screen
          Actions.home();
        }
      }
    });
    return (
          <View style={this.props.style}>
            <FBSDKLoginButton
              style={styles.loginButton}
              onWillLogin={() => {
                FBSDKAccessToken.getCurrentAccessToken((result) => {
                  if (result) {
                    Actions.launch();
                  } else {
                    Actions.home();
                  }
                });
                return true;
              }}
              onLoginFinished={(error, result) => {
                if (error) {
                  alert('Error while logging in.');
                  console.log(error);
                } else {
                  if (result.isCancelled) {
                    alert('Login cancelled.');
                  }
                }
              }}
              onLogoutFinished={() => {
                Actions.launch();
              }}
              readPermissions={[]}
              publishPermissions={[]}/>
          </View>
        );
  }
}

const styles = StyleSheet.create({
  loginButton: {
    width: 200,
    height: 50,
  },
});
