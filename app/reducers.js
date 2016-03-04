'use strict'

import { combineReducers } from 'redux'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  ACCOUNTS_FETCH,
  ACCOUNTS_FETCH_SUCCESS,
  ACCOUNTS_FETCH_FAILURE,
  PAGE_SET_CURRENT,
} from './actions'

const initialLoginState = {
  requesting: false,
  success:    false,
  error:      null,
}

const login = (state = initialLoginState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        requesting: true,
        success:    false,
        error:      null,
      })
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        requesting: false,
        success:    true,
        error:      null,
      })
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        requesting: false,
        success:    false,
        error:      null,
      })
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        requesting: false,
        success:    false,
        error:      action.error,
      })
    default:
      return state;
  }
}

const initialAccountsState = {
  requesting: false,
  success:    false,
  error:      null,
}

const accounts = (state = initialAccountsState, action) => {
  switch (action.type) {
    case ACCOUNTS_FETCH:
      return Object.assign({}, state, {
        success:    false,
        requesting: true,
        error:      null,
      })
    case ACCOUNTS_FETCH_FAILURE:
      return Object.assign({}, state, {
        success:    false,
        requesting: false,
        error:      action.error,
      })
    case ACCOUNTS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        success:    true,
        requesting: false,
        error:      null,
        data:       action.accounts.data,
      })
    default:
      return state;
  }
}

const pages = (state = {currentPageId: undefined}, action) => {
  switch (action.type) {
    case PAGE_SET_CURRENT:
      return Object.assign({}, state, { currentPageId: action.pageid })
    default:
      return state;
  }
}

// -- combine and export
const rootReducer = combineReducers({ login, accounts, pages });
export default rootReducer
