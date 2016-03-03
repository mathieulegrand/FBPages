// Facebook Login component

'use strict'

import React,      { StyleSheet, View } from 'react-native'
import FBSDKLogin, { FBSDKLoginButton } from 'react-native-fbsdklogin'

export default class Login extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        <FBSDKLoginButton
          style={styles.loginButton}
          onLoginFinished={(error, result) => {
            if (error) {
              this.props.onLoginFailure();
            } else {
              if (result.isCancelled) {
                this.props.onLoginFailure();
              } else {
                this.props.onLoginSuccess();
              }
            }
          }}
          onLogoutFinished={() => {
            this.props.onLogoutSuccess();
          }}
          readPermissions={ this.props.readPermissions }
          publishPermissions={ this.props.publishPermissions }/>
      </View>
    );
  }
}

Login.propTypes = {
  onLoginFailure:     React.PropTypes.func.isRequired,
  onLoginSuccess:     React.PropTypes.func.isRequired,
  onLogoutSuccess:    React.PropTypes.func.isRequired,
  readPermissions:    React.PropTypes.array,
  publishPermissions: React.PropTypes.array,
}

Login.defaultProps = {
  readPermissions:    [],
  publishPermissions: [],
}

const styles = React.StyleSheet.create({
  loginButton: {
    width: 200,
    height: 50,
  },
});
