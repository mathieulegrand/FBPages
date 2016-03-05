'use strict';

import React, { Dimensions } from 'react-native';

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from '../actions'

import * as facebookAPI    from '../facebookAPI'
import ErrorBar            from '../components/errorBar'
import NavBar              from '../components/navBar'

var toolbarGap    = 40;
var navBarHeight  = 64;
var fixedOffset   = navBarHeight + toolbarGap;
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

  renderToolbar() {
    return (
      <React.View style={ styles.toolbar }>
        <React.Text style={ styles.toolbarText }>
          Publish
        </React.Text>
        <React.Switch
          value={this.state.publish}
          onValueChange={(value) => this.setState({publish: value})}
          style={ styles.toolbarSwitch }/>
      </React.View>
    )
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

    return (
      <NavBar
        title="New Post"
        onLeftPress={ this.props.gotoDefaultTab }
        leftButtonText="Cancel"
        onRightPress={ this.sendPost.bind(this) }
        rightButtonText="Post">
          <React.View style={{height: this.state.visibleHeight}}>
            { errorView }
            <React.TextInput multiline={true}
              onChangeText={(text) => {
                this.state.post.data = text;
              }}
              defaultValue={this.state.post.data}
              autoFocus={true}
              placeholder="Write something…"
              style={[styles.input, {height:this.state.visibleHeight}]} />
            { this.renderToolbar() }
          </React.View>
      </NavBar>
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
  toolbar: {
    height: toolbarGap,
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 0.5,
    borderColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    paddingLeft: 10,
  },
  toolbarText: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    paddingRight: 10,
    paddingLeft: 10,
  },
  toolbarSwitch: {
    marginBottom: 2,
  },
  input: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#FFF',
    fontFamily: 'System',
    fontSize: 18
  },
});
