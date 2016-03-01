'use strict';

export const NEW_POSTS = 'NEW_POSTS'
export const NEW_PAGES = 'NEW_PAGES'

export const getPosts = () => ({type: NEW_POSTS})
export const getPages = () => ({type: NEW_PAGES})
