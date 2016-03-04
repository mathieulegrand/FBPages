'use strict'

import _ from 'lodash'

// -- React components
import React  from 'react-native'
import Drawer from 'react-native-drawer'
import Icon   from 'react-native-vector-icons/Ionicons'

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from './actions'

// -- My components
import NavBarRouteMapper from './router'
import ControlPanel      from './controlPanel'
import WelcomeScene      from './welcomeScene'
import HomeScene         from './homeScene'
import PostScene         from './postScene'
import LoadingScene      from './loadingScene'

class Root extends React.Component {
  closeDrawer = () => { this.refs.drawer.close() };
  openDrawer  = () => { this.refs.drawer.open()  };

  constructor(props) {
    super(props);

    this.defaultTab = 'Page';

    this.state = {
      selectedTab: this.defaultTab,
    };
  }

  gotoDefaultTab() {
    this.setState({ selectedTab: this.defaultTab });
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
      <React.Navigator
        ref="navigator"
        showNavigationBar={true}
        initialRoute={ { id: myRoute } }
        style={ styles.navigator }
        renderScene={ this.navigatorRenderScene.bind(this) }
        openDrawer={ this.openDrawer.bind(this) }
        gotoDefaultTab={ this.gotoDefaultTab.bind(this) }
        sceneStyle={ styles.scene }
        navigationBar={ <React.Navigator.NavigationBar routeMapper={NavBarRouteMapper}
                                                       style={styles.navBar}/> }
      />
    );
  }

  navigatorRenderScene(route, navigator) {
    switch (route.id) {
      case 'Home':
        if (typeof this.props.pages.currentPageId === 'string') {
          let pageId = this.props.pages.currentPageId;
          return (<HomeScene navigator={navigator} visibilityProfile='published'/>);
        }
        break;
      case 'Post':
        return (<PostScene navigator={navigator}/>);
      default:
        console.log("unknown route", route.id);
    }
    return null;
  }

  componentWillMount() {
    const { dispatch, login } = this.props

    // try to do a profile info request, to test if we are logged in
    // if we are, the state will be set to login.success by the action
    dispatch(actionCreators.getInfo());
  }

  componentWillReceiveProps(props) {
    const { dispatch, login, accounts, pages } = props // ! the new props to be

    if (login.success && !accounts.success && !this.props.accounts.requesting) {
      // we just logged in, and we do not have accounts, nor are we currently requesting
      // then do request accounts list.
      dispatch(actionCreators.accounts())
    } else if (login.success && accounts.success && !pages.currentPageId) {
      // automatically select the first account if nothing is selected
      let newPageId = undefined;
      if (accounts.data && accounts.data.length > 0) {
        newPageId = accounts.data[0].id;
      }
      if (newPageId) {
        dispatch(actionCreators.pageSetCurrent(newPageId))
      }
    }
  }

  render() {
    const { dispatch, login, accounts } = this.props

    // the initial loading pages
    // we might need a better logic to allow user to retry if he gets stuck
    // on one of those screens for a long time…
    if (login.requesting) {
      return (<LoadingScene textMessage="Connecting to Facebook…"/>);
    } else if (login.success && (!accounts.success || accounts.requesting)) {
      return (<LoadingScene textMessage="Requesting list of accounts…"/>);
    }

    // If we are not logged in, display a welcome / login screen
    if (! login.success) {
      return ( <WelcomeScene/> );
    } else {
      return (
        <Drawer ref="drawer"
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                styles={{ main: drawerStyle }}
                tweenHandler={Drawer.tweenPresets.parallax}
                tapToClose={true}
                content={<ControlPanel closeDrawer={ this.closeDrawer.bind(this) }/>}>
          <React.TabBarIOS>
            { this._tabItem({ title:            'Page',
                              iconName:         'ios-list-outline',
                              selectedIconName: 'ios-list',
                              route:            'Home' }) }

            { this._tabItem({ title:            'New Post',
                              iconName:         'ios-plus-outline',
                              selectedIconName: 'ios-plus',
                              route:            'Post' })}
          </React.TabBarIOS>
        </Drawer>
      );
    }
  }
}

Root.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  login:    React.PropTypes.object.isRequired,
  accounts: React.PropTypes.object.isRequired,
  pages:    React.PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    login:    state.login,
    accounts: state.accounts,
    pages:    state.pages,
  }
}

export default connect(mapStateToProps)(Root);

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
  navBar:{
    backgroundColor: '#f8f8f8',
    borderBottomColor: '#c8c8c8',
    borderBottomWidth: 1
  },
  scene: {
    paddingTop: 64,
  },
});
