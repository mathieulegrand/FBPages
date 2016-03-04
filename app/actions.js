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

const pageinfoFetch        = (pageid)   => ({type: PAGEINFO_FETCH, pageid})
const pageinfoFetchSuccess = (pageinfo) => ({type: PAGEINFO_FETCH_SUCCESS, pageinfo})
const pageinfoFetchFailure = (error)    => ({type: PAGEINFO_FETCH_FAILURE, error})

// -- action methods
export function login() {
  return dispatch => {
    dispatch(loginRequest());
    facebookAPI.login().then((result) => {
      dispatch(loginSuccess());
    }).catch((err) => {
      dispatch(loginFailure(err))
    })
  }
}

export function logout() {
  return dispatch => {
    dispatch(logoutRequest())
    facebookAPI.logout().then(() => {
      dispatch(logoutSuccess())
    })
  }
}

export function getinfo() {
  return dispatch => {
    dispatch(loginRequest())
    facebookAPI.getInfo().then(() => {
      dispatch(loginSuccess());
    }).catch(() => {
      dispatch(logoutSuccess());
    })
  }
}

export function accounts() {
  return dispatch => {
    dispatch(accountsFetch())
    facebookAPI.accounts().then((accounts) => {
      dispatch(accountsFetchSuccess(accounts))
    }).catch((error) => {
      dispatch(accountsFetchFailure(error));
    })
  }
}

export function pageinfo(pageid) {
  return dispatch => {
    dispatch(pageinfoFetch())
    facebookAPI.pageDetails(pageid).then((pageDetails) => {
      dispatch(pageinfoFetchSuccess(pageDetails))
    }).catch((error) => {
      dispatch(pageinfoFetchFailure(error))
    })
  }
}
