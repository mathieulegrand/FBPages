'use strict';

import React, { View, Text, TextInput, ScrollView, Dimensions, DeviceEventEmitter } from 'react-native';

import { Router } from './router.js'

var buttonsGap    = 50;
var navBarHeight  = 64;
var fixedOffset   = navBarHeight + buttonsGap;
var tabBarHeight  = 48;

export default class PostScene extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleHeight: Dimensions.get('window').height - fixedOffset - tabBarHeight,
      post: { data: "" },
    };
  }

  componentWillMount () {
    DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
  }

  keyboardWillShow (e) {
    let newSize = Dimensions.get('window').height - e.endCoordinates.height - fixedOffset
    this.setState({visibleHeight: newSize})
  }

  keyboardWillHide (e) {
    this.setState({visibleHeight: Dimensions.get('window').height - fixedOffset - tabBarHeight})
  }

  render() {
    return (
      <View style={{height: this.state.visibleHeight}}>
        <TextInput multiline={true}
          onChangeText={(text) => {
            this.state.post.data = text;
          }}
          defaultValue={this.state.post.data}
          autoFocus={true}
          placeholder="Write something…"
          style={[styles.input, {height:this.state.visibleHeight}]}
        />
        <View><Text>Here are buttons</Text></View>
      </View>
    );
  }
}

const styles = React.StyleSheet.create({
  input: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#FFF',
    fontFamily: 'System',
    fontSize: 18
  }
});
