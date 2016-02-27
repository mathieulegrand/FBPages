/**
 * Application for the management of a Facebook Page.
 *
 * Features:
 * - create regular or unpublished posts to a Facebook Page
 * - able to list posts (published and/or unpublished)
 * - show the number of people who have viewed each post
 *
 * Author: Mathieu Legrand <mathieu@legrand.im>.
 *
**/
'use strict';

import React, { AppRegistry, Navigator, StyleSheet, Text, View, ScrollView, Image, PixelRatio, } from 'react-native';
import { Router, Route, Schema, Animations, TabBar } from 'react-native-router-flux';
import Drawer from 'react-native-drawer';

import Dimensions from 'Dimensions';

import FBSDKCore, { FBSDKGraphRequest } from 'react-native-fbsdkcore';

var window = Dimensions.get('window');

var ImageWidth = window.width;

import Login from './app/components/login.ios.js';

export default class FBPages extends React.Component {
  render() {
    return (
      <Router navigationBarStyle={styles.navBar}>
        <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
        <Schema name="slide" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
        <Schema name="default"/>

        <Route name="launch" component={Launch} hideNavBar wrapRouter initial/>
        <Route name="home"   component={Home}   title="Page" type="replace"
               renderLeftButton={()=>{}} styles={{content: styles.container}}/>
        <Route name='Drawer' hideNavBar={true} type='reset'>
          <SideDrawer>
            <Router>
              <Route name="with-drawer-a"/>
              <Route name="with-drawer-b"/>
            </Router>
          </SideDrawer>
        </Route>
      </Router>
    );
  }
}

class SideDrawerContent extends React.Component {
  render() {
    return (
      <View><Text>Hello</Text>
      </View>
    );
  }
}

class SideDrawer extends React.Component {
  render() {
    return (
      <Drawer type="overlay" content={<SideDrawerContent />} tapToClose={true}
              openDrawerOffset={0.2} panCloseMask={0.2} closedDrawerOffset={-3}
              styles={styles.drawerStyles}>
        {React.Children.map(children, c => React.cloneElement(c, {route: this.props.route}))}
      </Drawer>
    );
  }
}

class LongText extends React.Component {
  render() {
    return (
      <Text style={styles.textBox}>
        Lorem ipsum dolor sit amet, ne ius vero ferri ridens. Id his eirmod docendi. Inani vulputate ne per. Ex posse tempor neglegentur est, quo natum essent contentiones ad. Porro omittantur ne eos, veri option democritum sed eu, ea eos oporteat splendide. Sea et audire minimum epicurei, simul senserit cu vis, sea oblique abhorreant an. Pro at prompta concludaturque, duo nibh consulatu te, fuisset voluptua adipiscing vis ex.
        Summo electram te sit, no ius reque primis maluisset. Ex pro tempor repudiandae, accumsan deleniti partiendo pri te, at sit veri ponderum. Eu mea vocent delicata interpretaris. Dolorum offendit consetetur pri ut, ne putant definitionem sit, ut eum putant omittam definitionem. An pro idque bonorum epicurei, per no ferri expetenda, ad eos purto eripuit.
        Eu habemus deseruisse mel, duis equidem facilisis at his, no sea lorem facilisi. Qui an deserunt periculis, ut pri elitr libris audiam. Sit affert ornatus in, diam meliore ei vim, ex labores fastidii appareat usu. Vim no facilisi quaestio torquatos. In his natum dignissim.
        Cu odio voluptatum ius, zril intellegebat usu ex, illud erroribus percipitur ei quo. Cum verear debitis neglegentur ex, ex porro dolor quo. Viris dolor pro at. Forensibus disputando mel ad, option eripuit no est. Ei ius nihil affert putant.
        Elit appetere et ius. Nullam vituperatoribus id eum, an consequat constituam suscipiantur usu, ut pri sale ullum labore. Mucius quidam vidisse ne nec, in qui veniam fastidii democritum. Ei posse ipsum nostrud pri, ipsum singulis euripidis eu pro, mea ei ridens nostrud insolens.
      </Text>
    );
  }
}

class Home extends React.Component {
  constructor() {
    super();
      var feedRequest = new FBSDKGraphRequest(
      this._handleRequest.bind(this),
      '/652947674860909/feed',
      { fields: { string: 'link,message,story,type,attachments' } }
    );
    feedRequest.start();

    this.state = {
      feedEntries: [],
    };
  }

  _renderPhoto(photo) {
    var height = ImageWidth * (photo.height / photo.width);
    return (
      <View style={styles.imageBox} key={photo.key}>
        <Image source={{uri: photo.src}} style={{
            width: ImageWidth,
            height: height,
          }}
        />
      </View>
    );
  }

  _handleRequest(error, result) {
    if (!error) {
      let allViews = [];
      for (let entry of result.data) {
        switch (entry.type) {
          case "photo":
            if (entry.attachments && entry.attachments.data) {
              for (let attachment of entry.attachments.data) {
                if (attachment.media && attachment.media.image) {
                  allViews.push(this._renderPhoto({link: entry.link, key: entry.id, ...attachment.media.image}))
                  console.log("add ", entry, attachment.media.image);
                }
              }
            } else {
              console.log("photo: ", entry);
            }
            break;
          case "status":
            allViews.push(<Text style={styles.textBox} key={entry.id}>{entry.message}</Text>)
            break;
          case "link":
            break;
          case "video":
            break;
          case "offer":
            break;
          default:
            console.log("Unknown type "+entry.type);
            break;
        }
        console.log(entry);
      }
      this.setState({feedEntries: allViews});
    } else {
      console.log(error);
      alert(error.message);
    }
  }

  render() {
    return (
      <ScrollView style={styles.scrollStyle} contentContainerStyle={styles.page} automaticallyAdjustContentInsets={false}>
        {this.state.feedEntries}
        <Login style={styles.login}/>
      </ScrollView>
    );
  }
}

class Launch extends React.Component {
  render() {
    return (
      <View style={styles.scrollView}>
        <Text style={styles.welcome}>
          Welcome to{'\n'}
          Pages Manager
        </Text>
        <Login style={styles.login}/>
        <Text style={styles.instructions}>
          Connect to post updates to your Facebook Pages and
          see the number of people that have viewed your posts.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageBox: {
    marginTop: 5,
    marginBottom: 5,
  },
  textBox: {
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scrollStyle: {
    marginTop: 64, // workaround navBar and content overlapping
  },
  drawerStyles: {
    backgroundColor: "#FF0000",
  },
  page: {
    margin: 0,
    backgroundColor: '#c8c8c8',
  },
  welcome: {
    fontSize: 36,
    color: "#5A7EB0",
    fontWeight: "200",
    textAlign: 'center',
    marginTop: 80,
  },
  login: {
    margin: 10,
    alignItems: 'center',
  },
  navBar: {
    height: 64,
  },
  instructions: {
    fontSize: 15,
    color: "#989898",
    fontWeight: "400",
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
  }
});

AppRegistry.registerComponent('FBPages', () => FBPages);
