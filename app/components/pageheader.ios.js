// A component that displays the "header" of a Facebook Page

'use strict';

import React, { View, Image, Text } from 'react-native';
import FBSDKCore, { FBSDKGraphRequest } from 'react-native-fbsdkcore';

import Dimensions from 'Dimensions';
var window = Dimensions.get('window');
var ImageWidth = window.width;

export default class PageHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageId:     props.pageId,
      headerView: undefined,
    };

    var feedRequest = new FBSDKGraphRequest(
      this._handleRequest.bind(this),
      '/'+this.state.pageId,
      { fields: { string: 'name,about,category,cover,description,general_info,likes,new_like_count,picture' } }
    );
    feedRequest.start();
  }

  _handleRequest(error, result) {
    if (!error) {
      this.setState({ headerView:
        <Image source={{uri: result.cover.source}} resizeMode="contain" style={{
          flex: 1,
            width: ImageWidth,
            height: 135,
          }}>
          <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', margin: 10, }}>
            <Image source={{uri: result.picture.data.url}} style={{ width: 50, height: 50}}/>
            <View>
              <Text style={{ margin: 5, color: 'white', fontWeight: '600', fontSize: 20}}>{result.name}</Text>
              <Text style={{ margin: 5, color: 'white', fontWeight: '400'}}>{result.about}</Text>
            </View>
          </View>
        </Image>
      });
    } else {
      console.log(error);
      alert(error.message);
    }
  }

  render() {
    if (this.state.headerView) {
      return this.state.headerView;
    } else {
      return ( <View></View> );
    }
  }
}
