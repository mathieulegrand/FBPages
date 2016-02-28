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

export default class FBPages extends React.Component {
  render() {
    return (<Root/>);
  }
}

React.AppRegistry.registerComponent('FBPages', () => FBPages);
