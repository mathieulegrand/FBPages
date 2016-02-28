// The Facebook Page feed view

'use strict';

import React, { Text, View } from 'react-native';
import RefreshableListView   from 'react-native-refreshable-listview';

import PageHeader from './pageheader.ios.js';

export default class Page extends React.Component {
  constructor() {
    super();
  }

  reloadPage() {
  }

  renderPost() {
    return (<View/>);
  }

  render() {
    return (
      <RefreshableListView
        dataSource={this.state.dataSource}
        renderRow={this.renderPost}
        loadData={this.reloadPage}
      />
    );
  }
}
