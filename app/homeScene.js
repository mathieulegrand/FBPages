'use strict';

import React, { View, Text, Image } from 'react-native';
import FBSDKCore, { FBSDKGraphRequest } from 'react-native-fbsdkcore';
import GiftedListView from 'react-native-gifted-listview';
import Dimensions from 'Dimensions';

var window = Dimensions.get('window');

import Login  from './login.js';
import TimeAgo from './timeago';
import { Router } from './router.js'

export default class HomeScene extends React.Component {
  constructor(props) {
    super(props);

    let accountsRequest = new FBSDKGraphRequest(
      this._receiveListOfPages.bind(this),
      '/me/accounts',
      { fields: { string: 'id,name' } }
    ).start();

    this.state = {
      currentPageId: '',
      pagesList: [],
      // can be set to 'published', 'unpublished' or 'all'
      postsToShow: props.visibilityProfile || 'published',
      insights: {},
    };

    this.separatorId = 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("should?", this.props, nextProps, this.state, nextState);
    // Here we should decide whether we need to trigger a new fetch of the posts
    return true;
  }

  setPageId(pageId) {
    let pageDetailsRequest = new FBSDKGraphRequest(
      this._receivePageDetails.bind(this),
      '/'+pageId,
      { fields: { string: 'name,about,category,cover,description,general_info,likes,new_like_count,picture' } }
    ).start();
  }

  _receivePageDetails(error, result) {
    if (!error) {
      this.setState({ currentPageId: result.id, currentPageDetails: result });
    } else {
      console.log(error);
      alert("Error getting the page details: "+error.message);
    }
  }

  _receiveListOfPages(error, result) {
    if (! error) {
      if (result.data && result.data.length > 0) {
        let pagesList = [];
        for (let page of result.data) {
          pagesList.push({ id: page.id, name: page.name });
        }
        // the change of state will trigger a re-rendering of the page
        this.setState({ pagesList: pagesList });
        this.setPageId(pagesList[0].id);
      }
    } else {
      console.log("error calling /me/accounts", error);
      alert("Error loading list of Pages: "+error.message);
    }
  }

  _receiveInsight(error, result) {
    if (!error) {
      for (let entry of result.data) {
        console.log("Received insight for", entry)
        this.setState( (previousState, currentProps) => {
          let newState = previousState;
          newState[entry.id] = result;
          return { insights: newState };
        });
      }
    }
  }

  _receiveFeed(callback, error, result) {
    if (!error) {
      let rows = {};
      for (let entry of result.data) {
        // manually parse the date to get the year "2016-02-24T11:22:22+0000",
        let year = entry.created_time.split('-')[0];
        entry.safe_created_time = entry.created_time.slice(0,19);
        // push or create
        (rows[year] = rows[year] || []).push(entry);

        // Query the insights for each post
        let insights = new FBSDKGraphRequest(
          this._receiveInsight.bind(this),
          '/'+entry.id+'/insights',
          { fields: { string: 'page_posts_impressions,page_posts_impressions_unique' } }
        ).start();
      }
      callback(rows);
    } else {
      console.log("_receiveFeed error",error);
      alert("Failed to receive list of posts: "+error.message);
    }
  }

  _renderSectionHeaderView(sectionData, sectionID) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>
          {sectionID}
        </Text>
      </View>
    );
  }

  _renderPhoto(photo) {
    var height = window.width * (photo.height / photo.width);
    return (
      <View style={styles.imageBox} key={photo.key}>
        <Image source={{uri: photo.src}} style={{
            width: window.width,
            height: height,
          }}
        />
      </View>
    );
  }

  _renderSeparatorView() {
    return (
      <View style={styles.separator} key={this.separatorId++}/>
    );
  }

  _renderRowView(entry) {
    console.log("Render",entry);
    let contentView = [];
    switch (entry.type) {
      case "photo":
        let uniquify = 0;
        if (entry.message) {
          contentView.push(
            <View key={entry.id+uniquify} style={styles.textBox}>
              <Text style={styles.text}>{entry.message}</Text>
            </View>
          );
          uniquify++;
        }
        if (entry.attachments && entry.attachments.data) {
          for (let attachment of entry.attachments.data) {
            if (attachment.media && attachment.media.image) {
              contentView.push(this._renderPhoto({link: entry.link, key: entry.id+uniquify, ...attachment.media.image}));
              uniquify++;
            } else if (attachment.subattachments && attachment.subattachments.data) {
              for (let subattachment of attachment.subattachments.data) {
                contentView.push(this._renderPhoto({link: entry.link, key: entry.id+uniquify, ...subattachment.media.image}));
                uniquify++;
              }
            }
          }
        } else {
          console.log("photo: ", entry);
        }
        break;
      case "status":
        contentView.push(
          <View key={entry.id} style={styles.textBox}>
            <Text style={styles.text} key={entry.id}>{entry.message}</Text>
          </View>
        );
        console.log("status", entry);
        break;
      case "link":
        contentView.push(
          <View key={entry.id} style={styles.textBox}>
            <Text style={styles.text}>{entry.message}</Text>
            <Text style={styles.link}>{entry.link}</Text>
          </View>
        );
        console.log("link", entry);
        break;
      case "video":
        console.log("video", entry);
        break;
      case "offer":
        console.log("offer", entry);
        break;
      default:
        console.log("Unknown type "+entry.type);
        break;
    }
    // spread the components within the row view
    console.log(entry.from.picture);

    let story    = entry.story || "";
    let fromName = entry.from.name || "";
    if (story.indexOf(fromName) === 0) {
      story = story.slice(fromName.length);
    }
    return (
      <View>
        <View style={ styles.storyHeader } >
          <Image source={{uri:entry.from.picture.data.url}} style={ styles.storyFromImage }/>
          <Text style={ styles.storyDescription }>
            <Text style={ styles.storyFromName }>{fromName}</Text>
            <Text style={ styles.storyStory }>{story}</Text>
          </Text>
          <TimeAgo style={ styles.storyDate } interval={300000} time={entry.safe_created_time}/>
        </View>
        { contentView.map( (item) => { return item; } ) }
        <Text>{ this.state.insights.hasOwnProperty(entry.id)? "This post has "+this.state.insights[entry.id].page_posts_impressions_unique+" unique impressions." : ""}</Text>
      </View>
    );
  }

  _renderHeader() {
    let details = this.state.currentPageDetails;
    let about   = details.about;
    if (about.length > 80) {
      about = about.substring(0,80) + "…";
    }
    return (
      <View style={ styles.headerContainerView }>
        <Image source={{uri: details.cover.source}} resizeMode="cover" style={ styles.headerCoverImage }>
          <View style={ styles.headerDetailsContainer }>
            <Image source={{uri: details.picture.data.url}} style={ styles.headerPagePicture }/>
            <View>
              <Text style={ styles.headerPageName }>{details.name}</Text>
              <Text style={ styles.headerPageAbout }>{about}</Text>
            </View>
          </View>
        </Image>
      </View>
    );
  }

  _onFetch(page = 1, callback, options) {
    // console.log("Fetch", page, options);
    let url = '/'+this.state.currentPageId;
    let params = { fields: { string: 'link,message,story,type,attachments,from{name,picture},created_time' } };
    if (this.state.postsToShow === 'published') {
      url += '/feed';
    } else {
      url += '/promotable_posts';
      if (this.state.postsToShow !== 'all') {
        params['is_published'] = { string: 'false' };
      }
    }
    if (this.state.currentPageId.length > 0) {
      let feedRequest = new FBSDKGraphRequest(
        this._receiveFeed.bind(this, callback),
        url, params
      ).start();
    } else {
      alert("No page to fetch");
    }
  }

  getTitle() {
    return 'Page';
  }

  render() {
    if (this.state.currentPageId.length > 0) {
      return (
        <GiftedListView
          rowView={this._renderRowView.bind(this)}
          onFetch={this._onFetch.bind(this)}
          firstLoader={true}
          withSections={true}
          headerView={this._renderHeader.bind(this)}
          sectionHeaderView={this._renderSectionHeaderView.bind(this)}
          renderSeparator={this._renderSeparatorView.bind(this)}
        />
      );
    } else {
      // Empty view while I have no Page to display
      return (
        <View style={ styles.textBox }>
          <Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center'}}>Nothing yet.</Text>
        </View>
      );
    }
  }
}

const styles = React.StyleSheet.create({
  imageBox: {
  },
  storyFromImage: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  storyDescription: {
    marginLeft: 50,
    fontFamily: 'System',
    fontSize: 16,
    paddingBottom: 5,
    marginRight: 10,
  },
  storyHeader: {
    height: 55,
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  storyFromName: {
    fontWeight: "600",
  },
  storyStory: {
    fontWeight: "400",
  },
  storyDate: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: "300",
    marginLeft: 50,
  },
  textBox: {
    padding: 10,
    backgroundColor: '#FFF',
  },
  text: {
    fontFamily: 'System',
    fontSize: 18,
  },
  link: {
    fontFamily: 'System',
    fontSize: 18,
    color: "#5A7EB0",
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    backgroundColor: '#e8e8e8',
    padding: 10,
  },
  sectionHeaderTitle: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 18,
    color: '#a8a8a8',
    textShadowColor: "#c8c8c8",
    textShadowOffset: {width: -1, height: -1},
    textShadowRadius: 1,
  },
  separator: {
    height: 10,
    backgroundColor: '#e8e8e8',
  },
  headerDetailsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,.3)'
  },
  headerContainerView: {
    flex: 1,
    width: window.width,
    height: 160,
    margin: 0, padding: 0,
  },
  headerCoverImage: {
    flex: 1,
    width: window.width,
    resizeMode: 'stretch',
  },
  headerPagePicture: {
    position: 'absolute',
    bottom: 22,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 2,
  },
  headerPageName: {
    marginLeft: 55,
    color: 'white',
    fontWeight: '500',
    fontSize: 22,
    fontFamily: 'System',
  },
  headerPageAbout: {
    marginLeft: 55,
    color: '#dddddd',
    fontWeight: '400',
    fontFamily: 'System',
    fontSize: 12,
    fontStyle: 'italic'
  },
});
