/**
 * Application for the management of a Facebook Page.
 *
 * Features:
 * - create regular or unpublished posts to a Facebook Page
 * - able to list posts (published and/or unpublished)
 * - show the number of people who have viewed each post
 *
 * Author: Mathieu Legrand <mathieu@legrand.im>.
 *
**/
'use strict'

// -- React and Redux main libraries
import React          from 'react-native'
import { Provider }   from 'react-redux'

// -- Main redux store configuration, and Root component
import configureStore from './app/configureStore'
import Root           from './app/root'

const store = configureStore()

export default class FBPages extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root/>
      </Provider>
    )
  }
}

React.AppRegistry.registerComponent('FBPages', () => FBPages)
