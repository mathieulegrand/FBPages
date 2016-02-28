'use strict';

import React, { View, Text, Image } from 'react-native';
import FBSDKCore, { FBSDKGraphRequest } from 'react-native-fbsdkcore';
import GiftedListView from 'react-native-gifted-listview';
import Dimensions from 'Dimensions';

var window = Dimensions.get('window');

import Login  from './login.js';
import { Router } from './router.js'

export default class HomeScene extends React.Component {
  constructor() {
    super();

    let accountsRequest = new FBSDKGraphRequest(
      this._receiveListOfPages.bind(this),
      '/me/accounts',
      { fields: { string: 'id,name' } }
    ).start();

    this.state = {
      currentPageId: '',
      pagesList: [],
    };

    this.separatorId = 0;
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

  _receiveFeed(callback, error, result) {
    if (!error) {
      let rows = {};
      for (let entry of result.data) {
        let created_date = new Date(entry.created_time);
        let year         = created_date.getFullYear();
        // push or create
        (rows[year] = rows[year] || []).push(entry);
      }
      callback(rows);
    } else {
      console.log("_receiveFeed error",error);
      alert("Failed to receive list of posts: "+error.message);
    }
  }

  _renderSectionHeaderView(sectionData, sectionID) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
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
    switch (entry.type) {
      case "photo":
        let uniquify = 0;
        if (entry.attachments && entry.attachments.data) {
          for (let attachment of entry.attachments.data) {
            if (attachment.media && attachment.media.image) {
              return this._renderPhoto({link: entry.link, key: entry.id+uniquify, ...attachment.media.image});
              uniquify++;
            } else if (attachment.subattachments && attachment.subattachments.data) {
              for (let subattachment of attachment.subattachments.data) {
                return this._renderPhoto({link: entry.link, key: entry.id+uniquify, ...subattachment.media.image})
                uniquify++;
              }
            }
          }
        } else {
          console.log("photo: ", entry);
        }
        break;
      case "status":
        return (
          <Text style={styles.textBox} key={entry.id}>{entry.message}</Text>
        );
        console.log("status");
        break;
      case "link":
        console.log("link");
        break;
      case "video":
        console.log("video");
        break;
      case "offer":
        console.log("offer");
        break;
      default:
        console.log("Unknown type "+entry.type);
        break;
    }
    return (<View/>);
  }

  _renderHeader() {
    let details = this.state.currentPageDetails;
    return (
      <Image source={{uri: details.cover.source}} resizeMode="contain" style={{
        flex: 1,
          width: window.width,
          height: 135,
        }}>
        <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', margin: 10, }}>
          <Image source={{uri: details.picture.data.url}} style={{ width: 50, height: 50}}/>
          <View>
            <Text style={{ margin: 5, color: 'white', fontWeight: '600', fontSize: 20}}>{details.name}</Text>
            <Text style={{ margin: 5, color: 'white', fontWeight: '400'}}>{details.about}</Text>
          </View>
        </View>
      </Image>
    );
  }

  _onFetch(page = 1, callback, options) {
    console.log("Fetch", page, options);
    if (this.state.currentPageId.length > 0) {
      let feedRequest = new FBSDKGraphRequest(
        this._receiveFeed.bind(this, callback),
        '/'+this.state.currentPageId+'/feed',
        { fields: { string: 'link,message,story,type,attachments,from{name,picture},created_time' } }
      ).start();
    } else {
      alert("No page to fetch");
    }
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
        <View>
          <Text style={{textAlign: 'center'}}>No Page to manage</Text>
        </View>
      );
    }
  }
}

const styles = React.StyleSheet.create({
  imageBox: {
  },
  textBox: {
    padding: 10,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#e8e8e8',
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
  separator: {
    height: 10,
    backgroundColor: '#e8e8e8',
  }
});
