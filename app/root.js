'use strict';

import React       from 'react-native';
import ExNavigator from '@exponent/react-native-navigator';
import { Router }       from './router.js'
import CustomNavBar from './customNavBar.js'

export default class Root extends React.Component {
  render() {
    return (
      <ExNavigator
        showNavigationBar={true}
        initialRoute={Router.getWelcomeRoute()}
        style={{ flex: 1 }}
        sceneStyle={{ paddingTop: 64 }}
        renderNavigationBar={ props => <CustomNavBar {...props} /> }
      />
    );
  }
}
