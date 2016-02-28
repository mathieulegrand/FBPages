'use strict';

import React       from 'react-native';
import ExNavigator from '@exponent/react-native-navigator';
import Drawer      from 'react-native-drawer';
import Icon        from 'react-native-vector-icons/Ionicons';

import { Router }   from './router.js';
import CustomNavBar from './customNavBar.js';

export default class Root extends React.Component {
  closeDrawer = () => { this.refs.drawer.close() };
  openDrawer  = () => { this.refs.drawer.open()  };

  constructor() {
    super();
    this.state = {
      selectedTab: 'Page'
    };
  }

  _navigator(route) {
    return (
      <ExNavigator
        showNavigationBar={true}
        initialRoute={ route }
        style={{ flex: 1 }}
        sceneStyle={{ paddingTop: 64 }}
        openDrawer={ this.openDrawer }
        closeDrawer={ this.closeDrawer }
        renderNavigationBar={ props => <CustomNavBar {...props} /> }
      />
    );
  }

  render() {
    return (
      <Drawer ref="drawer"
              openDrawerOffset={0.2}
              panCloseMask={0.2}
              styles={{main: {shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3}}}
              tweenHandler={Drawer.tweenPresets.parallax}
              tapToClose={true}
              content={<React.View />}>
        <React.TabBarIOS style={{ height: 10 }}>
          <Icon.TabBarItem title="Page"
                           selected={ this.state.selectedTab === 'Page'}
                           onPress={() => { this.setState({ selectedTab: 'Page' }); }}
                           iconName="ios-list-outline"
                           selectedIconName="ios-list">
            { this._navigator(Router.getWelcomeRoute()) }
          </Icon.TabBarItem>
          <Icon.TabBarItem title="New Post"
                           selected={this.state.selectedTab === 'New'}
                           onPress={() => { this.setState({ selectedTab: 'New' }); }}
                           iconName="ios-plus-outline"
                           selectedIconName="ios-plus">
            { this._navigator(Router.getWelcomeRoute()) }
          </Icon.TabBarItem>
          <Icon.TabBarItem title="Share"
                           selected={this.state.selectedTab === 'Share'}
                           onPress={() => { this.setState({ selectedTab: 'Share' }); }}
                           iconName="ios-upload-outline"
                           selectedIconName="ios-upload">
            { this._navigator(Router.getWelcomeRoute()) }
          </Icon.TabBarItem>
          <Icon.TabBarItem title="Settings"
                           selected={this.state.selectedTab === 'Settings'}
                           onPress={() => { this.setState({ selectedTab: 'Settings' }); }}
                           iconName="ios-cog-outline"
                           selectedIconName="ios-cog">
            { this._navigator(Router.getWelcomeRoute()) }
          </Icon.TabBarItem>
        </React.TabBarIOS>
      </Drawer>
    );
  }
}
