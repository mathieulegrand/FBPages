'use strict'

import { combineReducers } from 'redux'
import {
  NEW_POSTS,
  NEW_PAGES,
} from './actions'

const initialFilterState = {
  viewPosts: 'published',
}

const filter = (state = initialFilterState, action) => {
  return state;
}

const rootReducer = combineReducers({
  filter,
})

export default rootReducer
