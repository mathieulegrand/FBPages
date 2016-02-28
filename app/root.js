'use strict';

import React       from 'react-native';
import ExNavigator from '@exponent/react-native-navigator';
import Drawer      from 'react-native-drawer';

import { Router }   from './router.js';
import CustomNavBar from './customNavBar.js';

export default class Root extends React.Component {
  closeDrawer = () => { this.refs.drawer.close() };
  openDrawer  = () => { this.refs.drawer.open()  };
  render() {
    return (
      <Drawer ref="drawer"
              openDrawerOffset={0.2}
              panCloseMask={0.2}
              styles={{main: {shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3}}}
              tweenHandler={Drawer.tweenPresets.parallax}
              tapToClose={true}
              content={<React.View />}>
        <ExNavigator
          showNavigationBar={true}
          initialRoute={Router.getWelcomeRoute()}
          style={{ flex: 1 }}
          sceneStyle={{ paddingTop: 64 }}
          openDrawer={ this.openDrawer }
          closeDrawer={ this.closeDrawer }
          renderNavigationBar={ props => <CustomNavBar {...props} /> }
        />
      </Drawer>
    );
  }
}
