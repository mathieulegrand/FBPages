'use strict';

import React, { View, Text, ActivityIndicatorIOS } from 'react-native';

export default class LoadingScene extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ margin: 20, textAlign: 'center', fontFamily: 'System', fontSize: 20}}>
          { this.props.textMessage }
        </Text>
        <React.ActivityIndicatorIOS size="large" color="#3b5998" />
      </View>
    );
  }
}
