'use strict';

import * as facebookAPI from './facebookAPI'

// -- action types
export const LOGIN_REQUEST  = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS  = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE  = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const ACCOUNTS_FETCH         = 'ACCOUNTS_FETCH'
export const ACCOUNTS_FETCH_SUCCESS = 'ACCOUNTS_FETCH_SUCCESS'
export const ACCOUNTS_FETCH_FAILURE = 'ACCOUNTS_FETCH_FAILURE'

export const PAGE_SET_CURRENT       = 'PAGE_SET_CURRENT'

export const PAGEINFO_FETCH         = 'PAGEINFO_FETCH'
export const PAGEINFO_FETCH_SUCCESS = 'PAGEINFO_FETCH_SUCCESS'
export const PAGEINFO_FETCH_FAILURE = 'PAGEINFO_FETCH_FAILURE'

export const PAGECONTENT_FETCH         = 'PAGECONTENT_FETCH'
export const PAGECONTENT_FETCH_SUCCESS = 'PAGECONTENT_FETCH_SUCCESS'
export const PAGECONTENT_FETCH_FAILURE = 'PAGECONTENT_FETCH_FAILURE'

export const POSTINSIGHTS_FETCH         = 'POSTINSIGHTS_FETCH'
export const POSTINSIGHTS_FETCH_SUCCESS = 'POSTINSIGHTS_FETCH_SUCCESS'
export const POSTINSIGHTS_FETCH_FAILURE = 'POSTINSIGHTS_FETCH_FAILURE'

// -- action creators
export const loginRequest   = () => ({type: LOGIN_REQUEST})
export const loginSuccess   = () => ({type: LOGIN_SUCCESS})
export const logoutRequest  = () => ({type: LOGOUT_REQUEST})
export const logoutSuccess  = () => ({type: LOGOUT_SUCCESS})
export const loginFailure   = (error) => ({type: LOGIN_FAILURE, error})

export const pageSetCurrent = (pageid)   => ({type: PAGE_SET_CURRENT, pageid})

const accountsFetch        = () => ({type: ACCOUNTS_FETCH})
const accountsFetchSuccess = (accounts) => ({type: ACCOUNTS_FETCH_SUCCESS, accounts})
const accountsFetchFailure = (error)    => ({type: ACCOUNTS_FETCH_FAILURE, error})

const pageinfoFetch        = ()         => ({type: PAGEINFO_FETCH})
const pageinfoFetchSuccess = (pageinfo) => ({type: PAGEINFO_FETCH_SUCCESS, pageinfo})
const pageinfoFetchFailure = (error)    => ({type: PAGEINFO_FETCH_FAILURE, error})

const pagecontentFetch        = ()            => ({type: PAGECONTENT_FETCH})
const pagecontentFetchSuccess = (pagecontent, shown) => ({
  type: PAGECONTENT_FETCH_SUCCESS,
  pagecontent,
  shown
})
const pagecontentFetchFailure = (error)       => ({type: PAGECONTENT_FETCH_FAILURE, error})

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

// -- action methods
// export function login() {
//   return dispatch => {
//     dispatch(loginRequest());
//     facebookAPI.login().then((result) => {
//       dispatch(loginSuccess());
//     }).catch((err) => {
//       dispatch(loginFailure(err))
//     })
//   }
// }

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
        resolve()
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
