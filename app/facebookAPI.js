'use strict'

import FBSDKCore,  { FBSDKGraphRequest } from 'react-native-fbsdkcore';
import FBSDKLogin, { FBSDKLoginManager } from 'react-native-fbsdklogin';

export function getPublishPermissions() {
  return new Promise((resolve, reject) => {
    FBSDKLoginManager.logInWithPublishPermissions(['manage_pages'], (error, result) => {
      if (error) {
        reject('error: ' + error);
      } else {
        if (result.isCancelled) {
          reject('error: login cancelled');
        } else {
          getInfo().then((userDetails) => {
            resolve(userDetails);
          }).catch((requestError) => {
            reject(requestError);
          });
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

export const getInfo  = () =>
  graphRequest('/me', { fields: { string: 'name,picture.width(300)' } })

export const accounts = () =>
  graphRequest('/me/accounts', { fields: { string: 'id,name,picture' } })

export const pageDetails  = (pageId) =>
  graphRequest(`/${pageId}`, { fields: { string: 'name,about,category,cover,description,general_info,likes,new_like_count,picture' } })

export const postInsights = (postId) =>
  graphRequest(`/${postId}/insights/post_impressions_unique/lifetime`, { fields: { string: 'name,id,period,values' } })

export const FEED_PUBLISHED   = 'published'
export const FEED_UNPUBLISHED = 'unpublished'
export const FEED_ALL         = 'all'

export const pageFeed = (pageId, postsToShow=FEED_PUBLISHED) => {
  let url    = `/${pageId}`;
  let params = { fields: { string: 'link,message,story,type,attachments,from{name,picture},created_time' } };
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

function graphRequest(path, params) {
  return new Promise((resolve, reject) => {
    return new FBSDKGraphRequest((error, result) => {
      if (error) {
        console.log(error);
        reject('error making request. ' + error);
      } else {
        resolve(result);
      }
    }, path, params).start();
  });
}
