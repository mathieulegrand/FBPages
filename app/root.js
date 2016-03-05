'use strict'

// -- React components
import React  from 'react-native'
import Drawer from 'react-native-drawer'
import Icon   from 'react-native-vector-icons/Ionicons'

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from './actions'

// -- My scenes
import ControlPanel  from './scenes/controlPanel'
import WelcomeScene  from './scenes/welcomeScene'
import HomeScene     from './scenes/homeScene'
import PostScene     from './scenes/postScene'

// -- My components
import Loading       from './components/loading'

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

  makeTabItem(options) {
    let route = <HomeScene openDrawer={ this.openDrawer.bind(this) }/>;
    if (options.route === 'Post') {
      route = <PostScene gotoDefaultTab={ this.gotoDefaultTab.bind(this) }/>;
    }

    return (
      <Icon.TabBarItem title={ options.title }
                       selected={ this.state.selectedTab === options.title }
                       onPress={() => { this.setState({ selectedTab: options.title }); }}
                       iconName={ options.iconName }
                       selectedIconName={ options.selectedIconName }>
        { route }
      </Icon.TabBarItem>
    );
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
      return (<Loading textMessage="Connecting to Facebook…"/>);
    } else if (login.success && (!accounts.success || accounts.requesting)) {
      return (<Loading textMessage="Requesting list of accounts…"/>);
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
            { this.makeTabItem({ title:            'Page',
                                 iconName:         'ios-list-outline',
                                 selectedIconName: 'ios-list',
                                 route:            'Home' }) }

            { this.makeTabItem({ title:            'New Post',
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
