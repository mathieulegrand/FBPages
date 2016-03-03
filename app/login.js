// Facebook Login component

'use strict'

import React,      { StyleSheet, View } from 'react-native'
import FBSDKLogin, { FBSDKLoginButton } from 'react-native-fbsdklogin'

// -- Redux store related
import { connect }           from 'react-redux'
import * as actionCreators   from './actions';

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
          readPermissions={ this.props.readPermissions }
          publishPermissions={ this.props.publishPermissions }/>
      </View>
    );
  }
}

Login.propTypes = {
  dispatch:           React.PropTypes.func.isRequired,
  login:              React.PropTypes.object,
  readPermissions:    React.PropTypes.array,
  publishPermissions: React.PropTypes.array,
}

Login.defaultProps = {
  readPermissions:    [],
  publishPermissions: [],
}

const mapStateToProps = (state) => { return { login: state.login } }

export default connect(mapStateToProps)(Login);

const styles = React.StyleSheet.create({
  loginButton: {
    width: 200,
    height: 50,
  },
});
