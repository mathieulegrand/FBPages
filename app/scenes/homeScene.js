'use strict'

import React       from 'react-native'
import SafariView  from 'react-native-safari-view'
import Icon        from 'react-native-vector-icons/Ionicons'
import Dimensions  from 'Dimensions'

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from '../actions'

import TimeAgo   from '../components/timeago'
import ErrorBar  from '../components/errorBar'
import Loading   from '../components/loading'
import NavBar    from '../components/navBar'

let separatorCounter = 0;
const window = Dimensions.get('window');

class HomeScene extends React.Component {
  componentWillMount() {
    this.reloadPageInfoIfNeeded(this.props.pages);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pages.currentPageId !== this.props.pages.currentPageId) {
      this.reloadPageInfoIfNeeded(nextProps.pages);
    }
  }

  reloadPageInfoIfNeeded(pages) {
    const { dispatch } = this.props

    if (pages.currentPageId) {
      dispatch(actionCreators.pageInfo(pages.currentPageId)).then( () => {
        dispatch(actionCreators.pageContentWithInsights(pages.currentPageId, pages.shown))
      })
    }
  }

  renderSectionHeaderView(sectionData, sectionID) {
    return (
      <React.View style={styles.sectionHeader}>
        <React.Text style={styles.sectionHeaderTitle}>
          {sectionID}
        </React.Text>
      </React.View>
    );
  }

  renderPhoto(photo) {
    var height = window.width * (photo.height / photo.width);
    return (
      <React.View style={styles.imageBox} key={photo.key}>
        <React.Image source={{uri: photo.src}} style={{
            width: window.width,
            height: height,
          }}
        />
      </React.View>
    );
  }

  renderSeparatorView() {
    return (
      <React.View style={styles.separator} key={separatorCounter++}/>
    );
  }

  renderRowView(entry) {
    let contentView = [];
    if (!entry) { return null }
    switch (entry.type) {
      case "photo":
        let uniquify = 0;
        if (entry.message) {
          contentView.push(
            <React.View key={entry.id+uniquify} style={styles.textBox}>
              <React.Text style={styles.text}>{entry.message}</React.Text>
            </React.View>
          );
          uniquify++;
        }
        if (entry.attachments && entry.attachments.data) {
          for (let attachment of entry.attachments.data) {
            if (attachment.media && attachment.media.image) {
              contentView.push(this.renderPhoto({link: entry.link, key: entry.id+uniquify, ...attachment.media.image}));
              uniquify++;
            } else if (attachment.subattachments && attachment.subattachments.data) {
              for (let subattachment of attachment.subattachments.data) {
                contentView.push(this.renderPhoto({link: entry.link, key: entry.id+uniquify, ...subattachment.media.image}));
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
          <React.View key={entry.id} style={styles.textBox}>
            <React.Text style={styles.text} key={entry.id}>{entry.message}</React.Text>
          </React.View>
        );
        break;
      case "link":
        contentView.push(
          <React.View key={entry.id} style={styles.textBox}>
            <React.Text style={styles.text}>
              {entry.message}
            </React.Text>
            <React.TouchableOpacity onPress={() => { SafariView.show({url: entry.link}) }}>
              <React.Text style={styles.link}>
                {entry.link}
              </React.Text>
            </React.TouchableOpacity>
          </React.View>
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
        insightsView = <Loading viewStyle={styles.loadingInsightsView}
                                textStyle={styles.loadingInsightsText}
                                activitySize="small"
                                activityColor="#ffffff"
                                textMessage="Loading insights"/>;
      } else if (entry.insights.success) {
        if (entry.insights.content) {
          insightsView = <React.Text style={styles.displayInsightsText}>This post has been viewed by {entry.insights.content.values[0].value} people.</React.Text>;
        } else {
          insightsView = <React.Text style={styles.displayInsightsText}>This post has no insights data</React.Text>;
        }
      } else if (entry.insights.error) {
        insightsView = <React.Text style={styles.displayInsightsText}>Error querying insights</React.Text>;
      }
    }
    return (
      <React.View>
        <React.View style={ styles.storyHeader } >
          <React.Image source={{uri:entry.from.picture.data.url}} style={ styles.storyFromImage }/>
          <React.Text style={ styles.storyDescription }>
            <React.Text style={ styles.storyFromName }>{fromName}</React.Text>
            <React.Text style={ styles.storyStory }>{story}</React.Text>
          </React.Text>
          <TimeAgo style={ styles.storyDate } interval={300000} time={entry.safe_created_time}/>
        </React.View>
        { contentView.map( (item) => { return item; } ) }
        { insightsView }
      </React.View>
    );
  }

  renderHeader() {
    let details = this.props.pages.pageInfo;
    let about   = details.about || "";
    let source  = details.cover? details.cover.source : "";
    if (about.length > 80) {
      about = about.substring(0,80) + "…";
    }
    return (
      <React.View style={ styles.headerContainerView }>
        <React.Image source={{uri: source}} resizeMode="cover" style={ styles.headerCoverImage }>
          <React.View style={ styles.headerDetailsContainer }>
            <React.Image source={{uri: details.picture.data.url}} style={ styles.headerPagePicture }/>
            <React.View>
              <React.Text style={ styles.headerPageName }>{details.name}</React.Text>
              <React.Text style={ styles.headerPageAbout }>{about}</React.Text>
            </React.View>
          </React.View>
        </React.Image>
      </React.View>
    );
  }

  render() {
    const { dispatch, login, pages } = this.props

    let navBarProps = {
      title:                "Page",
      leftButtonView:       (<Icon name="navicon-round" size={24} color="#5A7EB0" />),
      onLeftPress:          this.props.openDrawer,
      leftButtonStyle:      { alignItems: 'center' },
      buttonContainerStyle: { width: 50, justifyContent: 'center' }
    }

    if (!pages.currentPageId) {
      // Here maybe we do not have the pages_show_list permission?
      if (!login.permission || login.permission.indexOf('pages_show_list') === -1) {
        return (
          <NavBar {...navBarProps}>
            <React.View style={ styles.textBox }>
              <React.Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center', margin: 10 }}>
                Permission to list of managed Pages has not been granted.
              </React.Text>
              <React.TouchableOpacity onPress={() => { dispatch(actionCreators.logout()) }}>
                <React.Text style={{
                  fontFamily: 'System', fontSize: 18, fontWeight: '600',
                  textAlign: 'center', margin: 30, color: "#5A7EB0" }}>
                  Logout?
                </React.Text>
              </React.TouchableOpacity>
            </React.View>
          </NavBar>
        )
      }
      return (
        <NavBar {...navBarProps}>
          <React.View style={ styles.textBox }>
            <React.Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center'}}>
              No page to manage.
            </React.Text>
          </React.View>
        </NavBar>
      )
    }

    if (pages.requestingInfo) {
      return (<NavBar {...navBarProps}><Loading textMessage="Getting page details…"/></NavBar>);
    }

    if (pages.requestingContent) {
      return (<NavBar {...navBarProps}><Loading textMessage="Getting page posts…"/></NavBar>);
    }

    let errorBar = null;
    if (pages.successPost) {
      errorBar = <ErrorBar green={true} textMessage={"New message sent successfully"}
                           onPress={ () => { dispatch(actionCreators.clearPostSent()) } } />;
    }

    if (pages.currentPageId && pages.successInfo) {
      return (
        <NavBar {...navBarProps}>
          { errorBar }
          <React.ListView
            dataSource={this.props.dataSource}
            renderRow={this.renderRowView.bind(this)}
            renderHeader={this.renderHeader.bind(this)}
            renderSectionHeader={this.renderSectionHeaderView.bind(this)}
            renderSeparator={this.renderSeparatorView.bind(this)} />
        </NavBar>
      )
    }

    // else
    return (
      <NavBar {...navBarProps}>
        <React.View style={ styles.textBox }>
          <React.Text style={{ fontFamily: 'System', fontSize: 18, textAlign: 'center'}}>
            Error while loading page {pages.error}
          </React.Text>
        </React.View>
      </NavBar>
    )
  }
}

// Organise the data for the listView
// with key on the Year for the sections
function buildFeedDataSource(content) {
  let feed = {};
  for (let entry of Object.values(content)) {
    // manually parse the date to get the year "2016-02-24T11:22:22+0000",
    entry.year = entry.created_time.split('-')[0];
    entry.safe_created_time = entry.created_time.slice(0,19);
    // push or create
    (feed[entry.year] = feed[entry.year] || []).push(entry);
  }
  return feed;
}

HomeScene.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  login:    React.PropTypes.object,
  accounts: React.PropTypes.object,
  pages:    React.PropTypes.object,
}

const mapStateToProps = (state) => {
  const dataSource = new React.ListView.DataSource({
    rowHasChanged:           (r1, r2) => r1.id !== r2.id,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
  });

  return {
    login:      state.login,
    accounts:   state.accounts,
    pages:      state.pages,
    dataSource: dataSource.cloneWithRowsAndSections(buildFeedDataSource(state.pages.pageContent))
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
    padding: 2,
  },
  sectionHeaderTitle: {
    color: '#fff',
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 14,
    color: '#a8a8a8',
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
});
