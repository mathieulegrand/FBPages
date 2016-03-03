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

const accounts = (state = [], action) => {
  switch (action.type) {
    case ACCOUNTS_FETCH_SUCCESS:
      if (action.accounts.data) {
        return Object.assign([], state, action.accounts.data);
      }
    default:
      return state;
  }
}

// -- combine and export
const rootReducer = combineReducers({ login, accounts });
export default rootReducer
