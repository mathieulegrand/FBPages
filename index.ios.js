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

import Dimensions from 'Dimensions';

import FBSDKCore, { FBSDKGraphRequest } from 'react-native-fbsdkcore';

var window = Dimensions.get('window');

var ImageWidth = window.width;

import Root from './app/root.js';

class TabIcon extends React.Component {
    render(){
        return (
            <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
        );
    }
}


export default class FBPages extends React.Component {
  static childContextTypes = {
    drawer: React.PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      drawer: null,
    };
  }

  render() {
    const { drawer } = this.state;

    return (<Root/>);

    return (
      <Router navigationBarStyle={styles.navBar}>
        <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
        <Schema name="slide" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
        <Schema name="default"/>
        <Schema name="tab" type="switch" icon={TabIcon} />

        <Route name="launch" component={Launch} hideNavBar wrapRouter initial/>
        <Route name="home"   component={Home}   title="Page" type="replace"
               styles={{content: styles.container}}
               onLeft={() => { console.log("Right button pressed"); Actions.Drawer(); }}
               leftTitle="Testing"/>
        <Route name='Drawer' showNavigationBar={false} type='reset'>
          <SideDrawer>
            <Router showNavigationBar={false}>
              <Route name="with-drawer-a" title="A" schema='slide' component={Home}/>
              <Route name="with-drawer-b" title="B" schema='slide' component={Home}/>
            </Router>
          </SideDrawer>
        </Route>
      </Router>
    );
  }
}

class PostHeader extends React.Component {
  render() {
    return (
      <View>
        <Image source={{uri: this.props.picture.url}} style={{
            width: 20,
            height: 20,
          }}/>
        <View>
          <Text>{this.props.story? this.props.story : this.props.name}</Text>
          <Text>{this.props.created_time}</Text>
        </View>
      </View>
    );
  }
}

class Post extends React.Component {
  render() {
    return (
      <View>
        <PostHeader {...this.props}/>
        if (this.props.message) {
          <Text>this.props.message</Text>
        }
      </View>
    );
  }
}

class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      pageId:      '652947674860909',
      feedEntries: [],
    };

    // to get the list of pages I administer
    // /me/accounts
    let pageRequest = new FBSDKGraphRequest(
      function(error, result) {
        if (!error) {
          if (result.data && result.data.length > 0) {
            console.log(result.data[0].id + " " + result.data[0].name);
          }
        } else {
          console.log("Page request error", error)
          alert(error);
        }
      },
      '/me/accounts',
      { fields: { string: 'id,name'} }
    ).start();

    var feedRequest = new FBSDKGraphRequest(
    this._handleRequest.bind(this),
      '/'+this.state.pageId+'/feed',
      { fields: { string: 'link,message,story,type,attachments,from{name,picture},created_time' } }
    );
    feedRequest.start();
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
            let uniquify = 0;
            if (entry.attachments && entry.attachments.data) {
              for (let attachment of entry.attachments.data) {
                if (attachment.media && attachment.media.image) {
                    this.setState(function(previousState, currentProps) {
                      previousState.feedEntries.push(
                        this._renderPhoto({link: entry.link, key: entry.id+uniquify, ...attachment.media.image})
                      );
                    });
                  uniquify++;
                } else if (attachment.subattachments && attachment.subattachments.data) {
                  for (let subattachment of attachment.subattachments.data) {
                    this.setState(function(previousState, currentProps) {
                      previousState.feedEntries.push(
                        this._renderPhoto({link: entry.link, key: entry.id+uniquify, ...subattachment.media.image})
                      );
                    });
                    uniquify++;
                  }
                }
              }
            } else {
              console.log("photo: ", entry);
            }
            break;
          case "status":
            this.setState(function(previousState, currentProps) {
              previousState.feedEntries.push(
                <Text style={styles.textBox} key={entry.id}>{entry.message}</Text>
              );
              console.log(entry);
            });
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
    } else {
      console.log("_handleMessage error",error);
      alert(error.message);
    }
  }

  render() {
    return (
      <ScrollView style={styles.scrollStyle} contentContainerStyle={styles.page} automaticallyAdjustContentInsets={false}>
        <PageHeader pageId={this.state.pageId}/>
        {this.state.feedEntries}
        <Login style={styles.login}/>
      </ScrollView>
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
  login: {
    margin: 10,
    alignItems: 'center',
  },
  navBar: {
    height: 64,
  },
});

AppRegistry.registerComponent('FBPages', () => FBPages);
