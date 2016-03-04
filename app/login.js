// Facebook Login component

'use strict'

import React,      { StyleSheet, View } from 'react-native'
import FBSDKLogin, { FBSDKLoginButton } from 'react-native-fbsdklogin'

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from './actions'

// Allows to request only readPermissions
// see https://github.com/facebook/react-native-fbsdk/issues/52
// "readPermissions and publishPermissions cannnot be requested at the same time
// on the login button (because you need to separate the requests for read and
// write permissions)"
// set only the readPermissions, and then use the LoginManager to request the
// publish permissions at a later time (when the user does some action that actually
// requires a publish).
class Login extends React.Component {
  render() {
    const { dispatch, login } = this.props
    return (
      <View style={this.props.style}>
        <FBSDKLoginButton
          style={styles.loginButton}
          onLoginFinished={(error, result) => {
            if (error) {
              dispatch(actionCreators.loginFailure());
            } else {
              if (result.isCancelled) {
                dispatch(actionCreators.loginFailure());
              } else {
                dispatch(actionCreators.loginSuccess());
              }
            }
          }}
          onLogoutFinished={() => {
            dispatch(actionCreators.logoutSuccess());
          }}
          readPermissions={ this.props.readPermissions }/>
      </View>
    );
  }
}

Login.propTypes = {
  dispatch:           React.PropTypes.func.isRequired,
  login:              React.PropTypes.object,
  readPermissions:    React.PropTypes.array,
}

Login.defaultProps = {
  readPermissions:    [],
}

const mapStateToProps = (state) => { return { login: state.login } }

export default connect(mapStateToProps)(Login);

const styles = React.StyleSheet.create({
  loginButton: {
    width: 200,
    height: 50,
  },
});
