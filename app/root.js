'use strict';

import React       from 'react-native';
import ExNavigator from '@exponent/react-native-navigator';
import Drawer      from 'react-native-drawer';
import Icon        from 'react-native-vector-icons/Ionicons';

import { Router }   from './router.js';
import CustomNavBar from './customNavBar.js';
import ControlPanel from './controlPanel.js';
import WelcomeScene from './welcomeScene.js';

export default class Root extends React.Component {
  closeDrawer = () => { this.refs.drawer.close() };
  openDrawer  = () => { this.refs.drawer.open()  };

  constructor(props) {
    super(props);

    this.state = {
      welcomeScreen: true,   // by default, we want to display the login screen
      selectedTab:   'Page',
    };
  }

  openWelcomeScreen() {
    this.setState({ welcomeScreen: true });
  }

  closeWelcomeScreen() {
    this.setState({ welcomeScreen: false });
  }

  navigate(route) {
    console.log("Navigate", this.refs.navigator);
  }

  _tabItem(options) {
    return (
      <Icon.TabBarItem title={ options.title }
                       selected={ this.state.selectedTab === options.title }
                       onPress={() => { this.setState({ selectedTab: options.title }); }}
                       iconName={ options.iconName }
                       selectedIconName={ options.selectedIconName }>
        { options.route ? this._navigator(options.route()) : null }
      </Icon.TabBarItem>
    );
  }

  _navigator() {
    return (
      <ExNavigator
        ref="navigator"
        showNavigationBar={true}
        initialRoute={ Router.getHomeRoute() }
        style={ styles.navigator }
        sceneStyle={ styles.scene }
        openDrawer={ this.openDrawer }
        closeDrawer={ this.closeDrawer }
        renderNavigationBar={ props => <CustomNavBar {...props} /> }
      />
    );
  }

  render() {
    // The main View contains either the Welcome / Login window (if this.state.welcomeScreen is true),
    // or the mainScreen showing the Page and the tabs
    if (this.state.welcomeScreen) {
      return (
        <WelcomeScene style={styles.modal}
                      openWelcomeScreen={  this.openWelcomeScreen.bind(this) }
                      closeWelcomeScreen={ this.closeWelcomeScreen.bind(this) }
        />
      );
    } else {
      // this.state.welcomeScreen is false, draw the main "logged in" screen
      return (
        <Drawer ref="drawer"
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                styles={{ main: { shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3, } }}
                tweenHandler={Drawer.tweenPresets.parallax}
                tapToClose={true}
                content={<ControlPanel navigate={this.navigate.bind(this)}
                                       openWelcomeScreen={this.openWelcomeScreen.bind(this)}
                                       openDrawer={  this.openDrawer.bind(this) }
                                       closeDrawer={ this.closeDrawer.bind(this) }/>}>
          <React.TabBarIOS>
            { this._tabItem({ title: 'Page', iconName: "ios-list-outline", selectedIconName: "ios-list", route: Router.getWelcomeRoute}) }
            { this._tabItem({ title: 'New Post', iconName: 'ios-plus-outline', selectedIconName: 'ios-plus' })}
          </React.TabBarIOS>
        </Drawer>
      );
    }
  }
}

const styles = React.StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    flex: 1,
  },
  scene: {
    paddingTop: 64,
  },
});
