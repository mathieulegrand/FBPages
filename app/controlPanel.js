'use strict';

import _ from 'lodash'
import React, { View, Text, TouchableOpacity } from 'react-native'

// -- Redux store related
import { connect }         from 'react-redux'
import * as actionCreators from './actions'

import Login  from './login'

const PAGES_SECTION = 'Pages'
const controlMenu = {
  'Help & Settings': [{
    name:   "Logout",
    action: (dispatch) => { dispatch(actionCreators.logout()); }
  }]
};

export default class ControlPanel extends React.Component {
  constructor() {
    super();
    var dataSource = new React.ListView.DataSource({
        rowHasChanged: (r1, r2) => r1.id !== r2.id,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this._buildMenu(controlMenu))
    }
  }

  // Append the section to each menu item
  _buildMenu(menuDescription) {
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
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this._buildMenu(newMenu), order)
      });
    }
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <Text style={{fontWeight: "700"}}>{sectionID}</Text>
    )
  }

  renderRow(item) {
    if (item.section === PAGES_SECTION) {
      item.action = (dispatch) => { dispatch(actionCreators.pageinfo(item.id)); }
    }
    return (
      <TouchableOpacity onPress={ () => {
        if (typeof item.action === 'function') {
          item.action(this.props.dispatch)
        }
      }}>
        <Text>
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
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 25,
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
