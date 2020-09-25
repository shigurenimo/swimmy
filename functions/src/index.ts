/* eslint-disable @typescript-eslint/no-var-requires */

import admin from 'firebase-admin'

admin.initializeApp()

const SERVICE = process.env.K_SERVICE

if (!SERVICE || SERVICE === 'createLike') {
  exports.createLike = require('./createLike')
}

if (!SERVICE || SERVICE === 'createPost') {
  exports.createPost = require('./createPost')
}

if (!SERVICE || SERVICE === 'images') {
  exports.images = require('./images')
}

if (!SERVICE || SERVICE === 'onCreateAuthUser') {
  exports.onCreateAuthUser = require('./onCreateAuthUser')
}

if (!SERVICE || SERVICE === 'onCreateLike') {
  exports.onCreateLike = require('./onCreateLike')
}

if (!SERVICE || SERVICE === 'onCreatePost') {
  exports.onCreatePost = require('./onCreatePost')
}

if (!SERVICE || SERVICE === 'onDeleteAuthUser') {
  exports.onDeleteAuthUser = require('./onDeleteAuthUser')
}

if (!SERVICE || SERVICE === 'onDeleteFile') {
  exports.onDeleteFile = require('./onDeleteFile')
}

if (!SERVICE || SERVICE === 'onDeleteLike') {
  exports.onDeleteLike = require('./onDeleteLike')
}

if (!SERVICE || SERVICE === 'onDeletePost') {
  exports.onDeletePost = require('./onDeletePost')
}

if (!SERVICE || SERVICE === 'onDeleteStorageObject') {
  exports.onDeleteStorageObject = require('./onDeleteStorageObject')
}

if (!SERVICE || SERVICE === 'onFinalizeStorageObject') {
  exports.onFinalizeStorageObject = require('./onFinalizeStorageObject')
}

if (!SERVICE || SERVICE === 'onRunPreflight') {
  exports.onRunPreflight = require('./onRunPreflight')
}

if (!SERVICE || SERVICE === 'onRunStatistics') {
  exports.onRunStatistics = require('./onRunStatistics')
}

if (!SERVICE || SERVICE === 'onUpdatePost') {
  exports.onUpdatePost = require('./onUpdatePost')
}

if (!SERVICE || SERVICE === 'sitemap') {
  exports.sitemap = require('./sitemap')
}
