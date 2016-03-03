'use strict';

import _ from 'lodash'
import React, { View, Text, TouchableOpacity } from 'react-native'
import Icon   from 'react-native-vector-icons/Ionicons';

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from './actions'

import Login  from './login'

// the default menu of the Drawer
const controlMenu = {
  'Help & Settings': [{
    name:   "Logout",
    action: (dispatch) => { dispatch(actionCreators.logout()); },
    icon:   <Icon name="power" size={18} color="#888888" />
  }]
};

// and the additional sections names
const PAGES_SECTION = 'Pages'

export default class ControlPanel extends React.Component {
  constructor() {
    super();
    var dataSource = new React.ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.buildMenu(controlMenu))
    }
  }

  // Append the section to each menu item
  // in order to identify the section when the item is passed to renderRow
  buildMenu(menuDescription) {
    let menu = {};
    for (let [section, entries] of Object.entries(menuDescription)) {
      menu[section] = entries;      // copy the old entries
      for (let entry of entries) {
        entry.section = section;    // add the section key to each entry
      }
    }
    return menu;
  }

  componentWillReceiveProps(props) {
    // If we receive a new list of pages, update the menu
    if (props.accounts) {
      let newMenu = _.assign(controlMenu, { [PAGES_SECTION]: props.accounts }); // ! ES6 ComputedPropertyName
      let order   = _.union([ PAGES_SECTION ], Object.keys(controlMenu));
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.buildMenu(newMenu), order)
      });
    }
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={ styles.headerView }>
        <Text style={ styles.headerText }>
          { String(sectionID).toUpperCase() }
        </Text>
      </View>
    )
  }

  renderRow(item) {
    // if the row belongs to the 'Pages' category, then
    // enrich the item with an action to dispatch, and an icon
    if (item.section === PAGES_SECTION) {
      console.log(item);
      item.action = (dispatch) => { dispatch(actionCreators.pageinfo(item.id)); }
      item.icon   = <React.Image source={{uri: item.picture.data.url}}
                                 style={ styles.pageImageSize }></React.Image>
    }
    return (
      <TouchableOpacity onPress={ () => {
        if (typeof item.action === 'function') {
          item.action(this.props.dispatch)
        }
      }} style={ styles.rowView }>
        <View style={ styles.iconView }>{ item.icon }</View>
        <Text style={ styles.rowText }>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  componentWillMount() {
    const { dispatch, accounts } = this.props

    // Get the list of pages that can be managed
    dispatch(actionCreators.accounts())
  }

  render() {
    const { dispatch, accounts } = this.props

    return (
      <React.ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login:    state.login,
    accounts: state.accounts,
  }
}

export default connect(mapStateToProps)(ControlPanel)

const styles = React.StyleSheet.create({
  container: {
    marginTop: 25,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 25,
  },
  pageImageSize: {
    width: 20,
    height: 20,
  },
  rowView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#cccccc',
  },
  rowText: {
    fontWeight: '400',
    fontSize: 16,
    fontFamily: 'System',
    paddingLeft: 5,
    paddingRight: 5,
  },
  headerView: {
    backgroundColor: '#eeeeee',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    padding: 8,
    fontWeight: '500',
    fontSize: 11,
    fontFamily: 'System',
    color: '#888888',
  },
  iconView: {
    width: 30,
    height: 30,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  separator: {
    height: 10,
    backgroundColor: 'red',
  },
  buttonContainer: {
    margin: 10,
  },
  controlPanelWelcome: {
    fontSize: 20,
    paddingBottom: 20,
    fontWeight:'bold',
  },
});
