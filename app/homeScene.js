'use strict';

import React, { View, Text, Image }     from 'react-native';
import FBSDKCore, { FBSDKGraphRequest } from 'react-native-fbsdkcore';

import GiftedListView from 'react-native-gifted-listview';
import SafariView     from 'react-native-safari-view'
import Icon           from 'react-native-vector-icons/Ionicons';
import Dimensions     from 'Dimensions';

var window = Dimensions.get('window');

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from './actions'

import TimeAgo      from './timeago';
import LoadingScene from './loadingScene'
import ErrorBar     from './errorBar'

let separatorCounter = 0;

class HomeScene extends React.Component {
  _safariView(url) {
    SafariView.isAvailable().then(() => { SafariView.show({url: url}) });
  }

  reloadPageInfoIfNeeded(pageId) {
    if (pageId) {
      this.props.dispatch(actionCreators.pageInfo(pageId));
    }
  }

  componentWillMount() {
    this.reloadPageInfoIfNeeded(this.props.pages.currentPageId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pages.currentPageId !== this.props.pages.currentPageId) {
      this.reloadPageInfoIfNeeded(nextProps.pages.currentPageId);
    }
  }

  _receiveFeed(callback) {
    const { dispatch, pages } = this.props
    if (pages.successContent) {
      let rows = {};
      for (let entry of pages.pageContent) {
        // manually parse the date to get the year "2016-02-24T11:22:22+0000",
        let year = entry.created_time.split('-')[0];
        entry.safe_created_time = entry.created_time.slice(0,19);
        // push or create
        (rows[year] = rows[year] || []).push(entry);

        this.props.dispatch(actionCreators.postInsights(entry.id))
      }
      callback(rows);
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
      <View style={styles.separator} key={separatorCounter++}/>
    );
  }

  _renderRowView(entry) {
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
        break;
      case "link":
        contentView.push(
          <View key={entry.id} style={styles.textBox}>
            <Text style={styles.text}>
              {entry.message}
            </Text>
            <React.TouchableOpacity onPress={() => { this._safariView(entry.link) }}>
              <Text style={styles.link}>
                {entry.link}
              </Text>
            </React.TouchableOpacity>
          </View>
        );
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

    let story    = entry.story || "";
    let fromName = entry.from.name || "";
    if (story.indexOf(fromName) === 0) {
      story = story.slice(fromName.length);
    }
    let insightsView = null;
    if (entry.insights) {
      if (entry.insights.requesting) {
        insightsView = <LoadingScene viewStyle={styles.loadingInsightsView}
                                     textStyle={styles.loadingInsightsText}
                                     activitySize="small"
                                     activityColor="#cccccc"
                                     textMessage="Loading insights"/>;
      } else if (entry.insights.success) {
        if (entry.insights.content) {
          insightsView = <Text style={styles.displayInsightsText}>This post has been viewed by {entry.insights.content.values[0].value} people.</Text>;
        } else {
          insightsView = <Text style={styles.displayInsightsText}>This post has no insights data</Text>;
        }
      } else if (entry.insights.error) {
        insightsView = <Text style={styles.displayInsightsText}>Error querying insights</Text>;
      }
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
        { insightsView }
      </View>
    );
  }

  _renderHeader() {
    let details = this.props.pages.pageInfo;
    let about   = details.about || "";
    let source  = details.cover? details.cover.source : "";
    if (about.length > 80) {
      about = about.substring(0,80) + "…";
    }
    return (
      <View style={ styles.headerContainerView }>
        <Image source={{uri: source}} resizeMode="cover" style={ styles.headerCoverImage }>
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
    this.props.dispatch(actionCreators.pageContent(this.props.pages.currentPageId, this.props.pages.shown)).then(() => {
      this._receiveFeed(callback)
    })
  }

  getTitle() {
    return 'Page';
  }

  renderWithNavBar(component) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.navBarContainer}>
          <React.TouchableOpacity
            onPress={ this.props.openDrawer }
            style={styles.buttonContainer}>
            <Icon name="navicon-round" size={24} color="#5A7EB0" />
          </React.TouchableOpacity>
          <View style={styles.navBarTitle}>
            <React.Text style={styles.navBarTitleText}>
              Page
            </React.Text>
          </View>
          <View style={styles.buttonContainer}/>
        </View>
        <ErrorBar green={true} display={true} id={separatorCounter++} textMessage="Test 123"/>
        {component}
      </View>
    );
  }

  render() {
    const { dispatch, pages } = this.props

    if (!pages.currentPageId) {
      return this.renderWithNavBar(
        <View style={ styles.textBox }>
          <Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center'}}>
            No page to manage
          </Text>
        </View>
      )
    }

    if (pages.currentPageId && pages.requestingInfo) {
      return this.renderWithNavBar(<LoadingScene textMessage="Getting page details…"/>);
    }

    if (pages.currentPageId && pages.successInfo) {
      return this.renderWithNavBar(
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
      return this.renderWithNavBar(
        <View style={ styles.textBox }>
          <Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center'}}>
            Error while loading page {pages.error}
          </Text>
        </View>
      )
    }
  }
}

HomeScene.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  accounts: React.PropTypes.object,
  pages:    React.PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    pages:    state.pages,
  }
}

export default connect(mapStateToProps)(HomeScene);

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
    paddingTop: 5,
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
  displayInsightsText: {
    fontFamily: 'System',
    fontSize: 14,
    color: '#a8a8a8',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    fontStyle: 'italic',
  },
  loadingInsightsView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingInsightsText: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 14,
    color: '#a8a8a8',
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
  navBarContainer: {
    paddingTop: 30,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderColor: '#b2b2b2',
    height: 64,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  navBarTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  navBarTitleText:{
    fontFamily: 'System',
    fontWeight: '500',
    fontSize:   18,
  },
  buttonContainer: {
    width: 50,
    overflow:'hidden',
    alignItems: 'center',
    justifyContent:'center',
  },
});
