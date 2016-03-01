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
'use strict';

import React from 'react-native';
import Root  from './app/root.js';
import { Provider }    from 'react-redux'
import { createStore } from 'redux'
import rootReducer     from './app/reducers'

const store = createStore(rootReducer)

export default class FBPages extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root/>
      </Provider>
    );
  }
}

React.AppRegistry.registerComponent('FBPages', () => FBPages);
