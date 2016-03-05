'use strict';

import React, { View, TouchableOpacity, Text, Navigator } from 'react-native';
import Icon   from 'react-native-vector-icons/Ionicons';

import HomeScene from './homeScene';
import PostScene from './postScene';

let NavBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    switch (route.id) {
      case 'Home':
        return (
          <TouchableOpacity
            onPress={() => {
              let props = navigator.props;
              if (typeof props.openDrawer === 'function') { props.openDrawer(); }
            }}
            style={styles.buttonContainer}>
            <Icon name="navicon-round" size={24} color="#5A7EB0" />
          </TouchableOpacity>
        );
      case 'Post':
        console.log("NAVI",navigator,navState)
        return (
          <TouchableOpacity onPress={ navigator.props.gotoDefaultTab }
                  style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        );
    }
    return null;
  },
  RightButton(route, navigator, index, navState) {
    switch (route.id) {
      case 'Post':
        return (
          <TouchableOpacity onPress={() => { typeof navigator.props.gotoDefaultTab === 'function' ? navigator.props.gotoDefaultTab() : null } }
                  style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <View style={styles.navBarTitle}>
        <React.Text style={styles.navBarTitleText}>
          { route.id === 'Home' ? 'Page' : 'New Post' }
        </React.Text>
      </View>
    );
  },
};

export default NavBarRouteMapper;

const styles = React.StyleSheet.create({
  buttonContainer: {
    height: 64,
    width: 64,
    overflow:'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent:'center',
  },
  buttonText: {
    marginLeft: 5,
    fontFamily: 'System',
    fontWeight: '400',
    fontSize:   16,
    color: '#5A7EB0',
  },
  navBarTitle:{
    justifyContent:'center',
    flex:1
  },
  navBarTitleText:{
    fontFamily: 'System',
    fontWeight: '500',
    fontSize:   18,
  }
});

