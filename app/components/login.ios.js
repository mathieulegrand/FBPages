// Facebook Login component

'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
} = React;

var FBSDKLogin = require('react-native-fbsdklogin');
var {
  FBSDKLoginButton,
  FBSDKLoginManager
} = FBSDKLogin;
var FBSDKCore = require('react-native-fbsdkcore');
var {
  FBSDKAccessToken,
} = FBSDKCore;

class Login extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        <FBSDKLoginButton
          style={styles.loginButton}
          onWillLogin={() => {
            FBSDKAccessToken.getCurrentAccessToken((result) => {
              if (result == null) {
                // Login
              } else {
                console.log(result);
                // Logout
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
          onLogoutFinished={() => alert('Logged out.')}
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

module.exports = Login;

