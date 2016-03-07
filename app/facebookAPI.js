'use strict'

import FBSDKCore,  { FBSDKGraphRequest, FBSDKAccessToken } from 'react-native-fbsdkcore'
import FBSDKLogin, { FBSDKLoginManager } from 'react-native-fbsdklogin'

// -- all the Graph requests are triggered from these functions returning Promises
// with the exception of the login button itself (in components/login.js)

export function getPublishPermissions(permissions = []) {
  return new Promise((resolve, reject) => {
    FBSDKLoginManager.logInWithPublishPermissions(permissions, (error, result) => {
      if (error) {
        reject('error: ' + error);
      } else {
        if (result.isCancelled) {
          reject('error: login cancelled');
        } else {
          resolve(result);
        }
      }
    });
  });
}

export function logout() {
  return new Promise((resolve) => {
    FBSDKLoginManager.logOut();
    return resolve();
  });
}

export const accounts = () =>
  graphRequest('/me/accounts', { fields: { string: 'id,name,picture' } })

export const pageDetails  = (pageId) =>
  graphRequest(`/${pageId}`, { fields: { string: 'name,about,category,cover,description,general_info,likes,new_like_count,picture' } })

export const postInsights = (postId) =>
  graphRequest(`/${postId}/insights/post_impressions_unique/lifetime`, { fields: { string: 'name,id,period,values' } })

export const pageToken = (pageId) =>
  graphRequest(`/${pageId}`, { fields: { string: 'access_token' }})

export const sendPost = (pageId, token, fields) => {
  let parameters = {};
  for (let key of Object.keys(fields)) {
    parameters[key] = { string: fields[key].toString() }
  }
  return graphRequest(`/${pageId}/feed`, parameters, token, undefined, 'POST')
}

export const FEED_PUBLISHED   = 'published'
export const FEED_UNPUBLISHED = 'unpublished'
export const FEED_ALL         = 'all'

export const pageFeed = (pageId, postsToShow=FEED_PUBLISHED) => {
  let url    = `/${pageId}`;
  let params = { fields: { string: 'link,message,story,type,attachments,from{name,picture},created_time' },
                 limit:  { string: '4'} };
  if (postsToShow === FEED_PUBLISHED) {
    url += '/feed';
  } else {
    url += '/promotable_posts';
    if (postsToShow !== FEED_ALL) {
      params['is_published'] = { string: 'false' };
    }
  }
  return graphRequest(url, params);
}

// -- the main graphRequest utility function
function graphRequest(path, params, token=undefined, version=undefined, method='GET') {
  return new Promise((resolve, reject) => {
    return new FBSDKGraphRequest(
      (error, result) => {
        if (error) {
          console.log(error);
          reject('error making request. ' + error);
        } else {
          resolve(result);
        }
      }, path, params, token, version, method).start();
  });
}

export function checkAccessToken() {
  return new Promise( (resolve, reject) => {
    return FBSDKAccessToken.getCurrentAccessToken(
      (tokenDetails) => {
        if (tokenDetails) {
          return FBSDKAccessToken.refreshCurrentAccessToken(
            (result) => {
              if (result.error) {
                reject(result.error)
              } else {
                // the token has been refreshed
                resolve(tokenDetails)
              }
            })
        } else {
          // we do not have a token
          reject()
        }
      })
  })
}

