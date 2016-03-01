'use strict';

import React, { Navigator, Text, TouchableOpacity } from 'react-native';
import Drawer from 'react-native-drawer';
import Icon   from 'react-native-vector-icons/Ionicons';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  getPosts,
  getPages,
} from './actions'

import { NavigationBarRouteMapper }   from './router';
import ControlPanel from './controlPanel';
import WelcomeScene from './welcomeScene';
import HomeScene    from './homeScene';
import PostScene    from './postScene';

export default class Root extends React.Component {
  closeDrawer = () => { this.refs.drawer.close() };
  openDrawer  = () => { this.refs.drawer.open()  };

  constructor(props) {
    super(props);

    this.defaultTab = 'Page';

    this.state = {
      welcomeScreen: true,   // by default, we want to display the login screen
      selectedTab:   this.defaultTab,
    };
  }

  gotoDefaultTab() {
    this.setState({ selectedTab: this.defaultTab });
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
        { options.route ? this._navigator(options.route) : null }
      </Icon.TabBarItem>
    );
  }

  _navigator(myRoute) {
    return (
      <Navigator
        ref="navigator"
        showNavigationBar={true}
        initialRoute={ { id: myRoute } }
        style={ styles.navigator }
        renderScene={this.navigatorRenderScene}
        openDrawer={ this.openDrawer.bind(this) }
        closeDrawer={ this.closeDrawer.bind(this) }
        gotoDefaultTab={ this.gotoDefaultTab.bind(this) }
        sceneStyle={styles.scene}
        navigationBar={ <Navigator.NavigationBar routeMapper={NavigationBarRouteMapper} style={Navigator.NavigatorNavigationBarStyles}/> }
      />
    );
  }

  navigatorRenderScene(route, navigator) {
    console.log(route);
    switch (route.id) {
      case 'Home':
        return (<HomeScene navigator={navigator} visibilityProfile='published'/>);
      case 'Post':
        return (<PostScene navigator={navigator}/>);
      default:
        console.log("unknown route", route.id);
    }
    return null;
  }

  render() {
    // The main View contains either the Welcome / Login window (if this.state.welcomeScreen is true),
    // or the mainScreen showing the Page and the tabs
    if (this.state.welcomeScreen) {
      return (
        <WelcomeScene openWelcomeScreen={  this.openWelcomeScreen.bind(this)  }
                      closeWelcomeScreen={ this.closeWelcomeScreen.bind(this) }
        />
      );
    } else {
      // this.state.welcomeScreen is false, draw the main "logged in" screen
      return (
        <Drawer ref="drawer"
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                styles={{ main: drawerStyle }}
                tweenHandler={Drawer.tweenPresets.parallax}
                tapToClose={true}
                content={<ControlPanel navigate={ this.navigate.bind(this) }
                                       openWelcomeScreen={ this.openWelcomeScreen.bind(this) }
                                       openDrawer={  this.openDrawer.bind(this) }
                                       closeDrawer={ this.closeDrawer.bind(this) }/>}>
          <React.TabBarIOS>
            { this._tabItem({ title: 'Page', iconName: "ios-list-outline", selectedIconName: "ios-list", route: 'Home' }) }
            { this._tabItem({ title: 'New Post', iconName: 'ios-plus-outline', selectedIconName: 'ios-plus', route: 'Post' })}
          </React.TabBarIOS>
        </Drawer>
      );
    }
  }
}

const stateToProps = (state) => {
  return {
    filter: state.filter
  }
}

const dispatchToProps = (dispatch) => {
  return bindActionCreators({
    getPosts,
    getPages,
  }, dispatch)
}

const drawerStyle = {
  shadowColor: "#000000",
  shadowOpacity: 0.4,
  shadowRadius: 3,
};

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
