'use strict';

import React, { View, Text, ActivityIndicatorIOS } from 'react-native';

export default class LoadingScene extends React.Component {
  render() {
    return (
      <View style={this.props.viewStyle}>
        <Text style={this.props.textStyle}>
          { this.props.textMessage }
        </Text>
        <React.ActivityIndicatorIOS size={this.props.activitySize} color={this.props.activityColor} />
      </View>
    );
  }
}

LoadingScene.defaultProps = {
  viewStyle:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textStyle:     { margin: 20, textAlign: 'center', fontFamily: 'System', fontSize: 20 },
  activitySize:  "large",
  activityColor: "#3b5998",
}
