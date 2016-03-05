'use strict'

import * as facebookAPI from './facebookAPI'

// -- all of my actions types, useful to get notified of typos
export const LOGIN_REQUEST               = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS               = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE               = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST              = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS              = 'LOGOUT_SUCCESS'
export const ACCOUNTS_FETCH              = 'ACCOUNTS_FETCH'
export const ACCOUNTS_FETCH_SUCCESS      = 'ACCOUNTS_FETCH_SUCCESS'
export const ACCOUNTS_FETCH_FAILURE      = 'ACCOUNTS_FETCH_FAILURE'
export const PAGE_SET_CURRENT            = 'PAGE_SET_CURRENT'
export const PAGEINFO_FETCH              = 'PAGEINFO_FETCH'
export const PAGEINFO_FETCH_SUCCESS      = 'PAGEINFO_FETCH_SUCCESS'
export const PAGEINFO_FETCH_FAILURE      = 'PAGEINFO_FETCH_FAILURE'
export const PAGECONTENT_FETCH           = 'PAGECONTENT_FETCH'
export const PAGECONTENT_FETCH_SUCCESS   = 'PAGECONTENT_FETCH_SUCCESS'
export const PAGECONTENT_FETCH_FAILURE   = 'PAGECONTENT_FETCH_FAILURE'
export const POSTINSIGHTS_FETCH          = 'POSTINSIGHTS_FETCH'
export const POSTINSIGHTS_FETCH_SUCCESS  = 'POSTINSIGHTS_FETCH_SUCCESS'
export const POSTINSIGHTS_FETCH_FAILURE  = 'POSTINSIGHTS_FETCH_FAILURE'
export const PUBLISH_PERMISSIONS_FETCH   = 'PUBLISH_PERMISSIONS_FETCH'
export const PUBLISH_PERMISSIONS_SUCCESS = 'PUBLISH_PERMISSIONS_SUCCESS'
export const PUBLISH_PERMISSIONS_FAILURE = 'PUBLISH_PERMISSIONS_FAILURE'
export const PAGE_TOKEN_FETCH            = 'PAGE_TOKEN_FETCH'
export const PAGE_TOKEN_FETCH_SUCCESS    = 'PAGE_TOKEN_FETCH_SUCCESS'
export const PAGE_TOKEN_FETCH_FAILURE    = 'PAGE_TOKEN_FETCH_FAILURE'
export const POST_SEND                   = 'POST_SEND'
export const POST_SEND_SUCCESS           = 'POST_SEND_SUCCESS'
export const POST_SEND_FAILURE           = 'POST_SEND_FAILURE'
export const TOKEN_ERRORS_CLEAR          = 'TOKEN_ERRORS_CLEAR'
export const POST_ERRORS_CLEAR           = 'POST_ERRORS_CLEAR'
export const POST_SENT_CLEAR             = 'POST_SENT_CLEAR'

// -- action creators: Login
export const loginRequest   = () => ({type: LOGIN_REQUEST})
export const loginSuccess   = () => ({type: LOGIN_SUCCESS})
export const logoutRequest  = () => ({type: LOGOUT_REQUEST})
export const logoutSuccess  = () => ({type: LOGOUT_SUCCESS})
export const loginFailure   = (error) => ({type: LOGIN_FAILURE, error})

export const pageSetCurrent = (pageid)   => ({type: PAGE_SET_CURRENT, pageid})

// -- action creators: Page
const accountsFetch        = ()         => ({type: ACCOUNTS_FETCH})
const accountsFetchSuccess = (accounts) => ({type: ACCOUNTS_FETCH_SUCCESS, accounts})
const accountsFetchFailure = (error)    => ({type: ACCOUNTS_FETCH_FAILURE, error})
const pageinfoFetch        = ()         => ({type: PAGEINFO_FETCH})
const pageinfoFetchSuccess = (pageinfo) => ({type: PAGEINFO_FETCH_SUCCESS, pageinfo})
const pageinfoFetchFailure = (error)    => ({type: PAGEINFO_FETCH_FAILURE, error})

const pagecontentFetch        = ()                   => ({type: PAGECONTENT_FETCH})
const pagecontentFetchSuccess = (pagecontent, shown) => ({
  type: PAGECONTENT_FETCH_SUCCESS,
  pagecontent,
  shown
})
const pagecontentFetchFailure = (error)       => ({type: PAGECONTENT_FETCH_FAILURE, error})

// -- action creators: Posts insights
const postinsightsFetch        = (postid) => ({
  type: POSTINSIGHTS_FETCH,
  postid,
})
const postinsightsFetchSuccess = (postid, postinsights) => ({
  type: POSTINSIGHTS_FETCH_SUCCESS,
  postid,
  postinsights,
})
const postinsightsFetchFailure = (postid, error) => ({
  type: POSTINSIGHTS_FETCH_FAILURE,
  postid,
  error,
})

// -- action creators: Publish and Page Token
const publishPermissionsFetch    = ()       => ({type: PUBLISH_PERMISSIONS_FETCH})
const publishPermissionsSuccess  = (result) => ({type: PUBLISH_PERMISSIONS_SUCCESS, result})
const publishPermissionsFailure  = (error)  => ({type: PUBLISH_PERMISSIONS_FAILURE, error})
const pageTokenFetch             = ()       => ({type: PAGE_TOKEN_FETCH})
const pageTokenFetchSuccess      = (result) => ({type: PAGE_TOKEN_FETCH_SUCCESS, result})
const pageTokenFetchFailure      = (error)  => ({type: PAGE_TOKEN_FETCH_FAILURE, error})

// -- action creators: Posting
const postSend            = ()       => ({type: POST_SEND})
const postSendSuccess     = (result) => ({type: POST_SEND_SUCCESS, result})
const postSendFailure     = (error)  => ({type: POST_SEND_FAILURE, error})

// -- action creators: Clearing messages
const tokenErrorsClear    = () => ({type: TOKEN_ERRORS_CLEAR})
const postErrorsClear     = () => ({type: POST_ERRORS_CLEAR})
const postSentClear       = () => ({type: POST_SENT_CLEAR})

// -- action methods

export function logout() {
  return dispatch => {
    dispatch(logoutRequest())
    facebookAPI.logout().then(() => {
      dispatch(logoutSuccess())
    })
  }
}

export function getInfo() {
  return dispatch => {
    dispatch(loginRequest())
    facebookAPI.getInfo().then(() => {
      dispatch(loginSuccess())
    }).catch(() => {
      dispatch(logoutSuccess())
    })
  }
}

export function accounts() {
  return dispatch => {
    dispatch(accountsFetch())
    facebookAPI.accounts().then((accounts) => {
      dispatch(accountsFetchSuccess(accounts))
    }).catch((error) => {
      dispatch(accountsFetchFailure(error))
    })
  }
}

export function clearTokenErrors() {
  return dispatch => { dispatch(tokenErrorsClear()) }
}

export function clearPostErrors() {
  return dispatch => { dispatch(postErrorsClear()) }
}

export function clearPostSent() {
  return dispatch => { dispatch(postSentClear()) }
}

// -- action methods returning Promises

export function pageInfo(pageId) {
  return dispatch => {
    dispatch(pageinfoFetch())
    return new Promise ( (resolve, reject) => {
      facebookAPI.pageDetails(pageId).then((pageDetails) => {
        dispatch(pageinfoFetchSuccess(pageDetails))
        resolve()
      }).catch((error) => {
        dispatch(pageinfoFetchFailure(error))
        reject(error)
      })
    })
  }
}

export function pageContent(pageId, postsToShow=facebookAPI.FEED_PUBLISHED) {
  return dispatch => {
    dispatch(pagecontentFetch())
    return new Promise( (resolve, reject) => {
      facebookAPI.pageFeed(pageId, postsToShow).then((pageContent) => {
        dispatch(pagecontentFetchSuccess(pageContent, postsToShow))
        resolve(pageContent)
      }).catch((error) => {
        dispatch(pagecontentFetchFailure(error))
        reject(error)
      })
    })
  }
}

export function postInsights(postId) {
  return dispatch => {
    dispatch(postinsightsFetch(postId))
    return new Promise( (resolve, reject) => {
      facebookAPI.postInsights(postId).then((postInsights) => {
        dispatch(postinsightsFetchSuccess(postId, postInsights))
        resolve()
      }).catch((error) => {
        dispatch(postinsightsFetchFailure(postId, error))
        reject(error)
      })
    })
  }
}

export function getPageToken(pageId, permissions=['manage_pages']) {
  return dispatch => {
    dispatch(publishPermissionsFetch())
    return new Promise( (resolve, reject) => {
      facebookAPI.getPublishPermissions(permissions).then( (result) => {
        dispatch(publishPermissionsSuccess(result))
        dispatch(pageTokenFetch())
        facebookAPI.pageToken(pageId).then( (result) => {
          dispatch(pageTokenFetchSuccess(result))
          resolve(result)
        }).catch( (error) => {
          dispatch(pageTokenFetchFailure(error))
          reject(error)
        })
      }).catch( (error) => {
        dispatch(publishPermissionsFailure(error))
        reject(error)
      })
    })
  }
}

export function sendPost(pageId, token, parameters) {
  return dispatch => {
    dispatch(postSend())
    return new Promise( (resolve, reject) => {
      facebookAPI.sendPost(pageId, token, parameters).then((result) => {
        dispatch(postSendSuccess(result))
        resolve(result)
      }).catch((error) => {
        dispatch(postSendFailure(error))
        reject(error)
      })
    })
  }
}
