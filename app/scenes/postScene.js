'use strict';

import React, { Dimensions } from 'react-native';

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from '../actions'

import * as facebookAPI    from '../facebookAPI'
import ErrorBar            from '../components/errorBar'

var buttonsGap    = 50;
var navBarHeight  = 64;
var fixedOffset   = navBarHeight + buttonsGap;
var tabBarHeight  = 48;

class PostScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: Dimensions.get('window').height - fixedOffset - tabBarHeight,
      post: { data: "" },
      publish: false,
    };
  }

  componentWillMount () {
    // this is used to resize the view when the keyboard appears / disappears
    React.DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    React.DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))

    // get Publish token when the user first switch to the view
    // ignore the error, as `render` will show an error message for the user
    this.props.dispatch(actionCreators.getPageToken(this.props.pages.currentPageId)).catch((e) => {})
  }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height - fixedOffset
    this.setState({visibleHeight: newSize})
  }

  keyboardWillHide (e) {
    this.setState({visibleHeight: Dimensions.get('window').height - fixedOffset - tabBarHeight})
  }

  getTitle() {
    return 'New Post';
  }

  sendPost() {
    const { dispatch, pages } = this.props

    let postAction = () => {
       dispatch(actionCreators.sendPost(pages.currentPageId, pages.pageToken, {
        message:   this.state.post.data,
        published: this.state.publish,
      })).then( () => {
        this.setState({ post: { data: "" }});
        this.props.gotoDefaultTab();
      }).catch((e) => { console.log(e) })
    }

    // if we do not have a token at this stage, we'll try requesting it again
    if (pages.pageToken) {
      postAction()
    } else {
      dispatch(actionCreators.getPageToken(pages.currentPageId)).then( () => {
        postAction()
      }).catch((e) => {})
    }
  }

  renderWithNavBar(component) {
    return (
      <React.View style={{ flex: 1 }}>
        <React.View style={styles.navBarContainer}>
          <React.TouchableOpacity
            onPress={ this.props.gotoDefaultTab }
            style={ [ styles.buttonContainer, { alignItems: 'flex-start' } ] }>
            <React.Text style={styles.buttonText}>Cancel</React.Text>
          </React.TouchableOpacity>
          <React.View style={styles.navBarTitle}>
            <React.Text style={styles.navBarTitleText}>
              Page
            </React.Text>
          </React.View>
          <React.TouchableOpacity
            onPress={ this.sendPost.bind(this) }
            style={ [ styles.buttonContainer, { alignItems: 'flex-end' } ] }>
            <React.Text style={styles.buttonText}>Post</React.Text>
          </React.TouchableOpacity>
        </React.View>
        { component }
      </React.View>
    );
  }

  render() {
    const { dispatch, pages } = this.props
    let errorView   = null;

    if (pages.errorToken || pages.errorPermissions) {
      let onPress = () => { dispatch(actionCreators.clearTokenErrors()) }
      errorView   = <ErrorBar textMessage="Could not get publish permissions" onPress={onPress}/>
    } else if (pages.errorPost) {
      let onPress = () => { dispatch(actionCreators.clearPostErrors()) }
      errorView   = <ErrorBar textMessage="Error while sending the post" onPress={onPress}/>
    }

    return this.renderWithNavBar(
      <React.View style={{height: this.state.visibleHeight}}>
        { errorView }
        <React.TextInput multiline={true}
          onChangeText={(text) => {
            this.state.post.data = text;
          }}
          defaultValue={this.state.post.data}
          autoFocus={true}
          placeholder="Write something…"
          style={[styles.input, {height:this.state.visibleHeight}]}
        />
        <React.View><React.Text>Here are more buttons</React.Text></React.View>
      </React.View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    pages:    state.pages,
  }
}

export default connect(mapStateToProps)(PostScene);

const styles = React.StyleSheet.create({
  input: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#FFF',
    fontFamily: 'System',
    fontSize: 18
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
    flex: 1,
    overflow:'hidden',
    justifyContent:'center',
  },
  buttonText: {
    marginLeft: 10,
    marginRight: 10,
    fontFamily: 'System',
    fontWeight: '500',
    fontSize:   16,
    color: '#5A7EB0',
  },
});
