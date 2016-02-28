// experimentations for the side drawer

'use strict'

import React, { View, Text } from 'react-native';
import Drawer from 'react-native-drawer';

class SideDrawerContent extends React.Component {
  static contextTypes = {
    drawer: React.PropTypes.object.isRequired,
  };

  render() {
    const { drawer } = this.context;
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  }
}

export default class SideDrawer extends React.Component {
  render() {
    return (
      <Drawer type="overlay" content={<SideDrawerContent />} tapToClose={true}
              openDrawerOffset={0.2} panCloseMask={0.2} closedDrawerOffset={-3}
              styles={{ backgroundColor: "#FF0000" }}
              tweenHandler={(ratio) => ({ main: { opacity: (2 - ratio) / 2 } })}>
        {React.Children.map(this.props.children, c => React.cloneElement(c, {route: this.props.route}))}
      </Drawer>
    );
  }
}


