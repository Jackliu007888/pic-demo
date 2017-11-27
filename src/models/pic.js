var Promise = require('promise-polyfill')

var storeBlock = require('../modules/upload/storeBlock')
var storePiece = require('../modules/upload/storePiece')
var wilddogUp = require('../modules/upload/wilddogUp.js')
var upload = require('../modules/upload/upload')
var config = require('../config.json')

var cloudPath = 'piece/'
var emailConfig = {
  service: 'QQex',
  auth: {
    user: config.upconfig.emailFrom,
    pass: config.upconfig.emailPass
  },
  from: config.upconfig.emailFrom,
  to: config.upconfig.emailTo,
  subject: 'Hello sir',
  text: 'Hello sir',
  attachments: [{
    filename: 'log',
    path: './dist/log.txt'
  }]
}

upload.setConfig({
  accessKeyId: config.upconfig.accessKeyId,
  accessKeySecret: config.upconfig.accessKeySecret,
  emailConfig: emailConfig
})

function add (encryptResult) {
  return Promise.all([
    _getStoreBlockAddPromise(encryptResult.resultBlock),
    _getStorePieceAddPromise(encryptResult.resultPiece),
    _getWilddogBlockAddPromise(encryptResult.resultBlock),
    _getCndPieceAddPromise(encryptResult.resultPiece)
  ])
}

function del (encryptResult) {
  return Promise.all([
    _getStoreBlockDelPromise(encryptResult.resultBlock),
    _getStorePieceDelPromise(encryptResult.resultPiece),
    _getWilddogBlockDelPromise(encryptResult.resultBlock)
  ])
}

module.exports = {
  add,
  del
}

function _getStoreBlockAddPromise (resultBlock) {
  return new Promise(function(resolve, reject) {
    storeBlock.add(resultBlock, function (uuid) {
      reject(uuid)
    }, function () {
      resolve()
    })
  })
}

function _getStoreBlockDelPromise (resultBlock) {
  return new Promise(function(resolve, reject) {
    storeBlock.del(resultBlock, function (uuid) {
      reject(uuid)
    }, function () {
      resolve()
    })
  })
}

function _getStorePieceAddPromise (resultPiece) {
  return new Promise(function(resolve, reject) {
    storePiece.add(resultPiece, function (uuid) {
      reject(uuid)
    }, function () {
      resolve()
    })
  })
}

function _getStorePieceDelPromise (resultPiece) {
  return new Promise(function(resolve, reject) {
    storePiece.del(resultPiece, function (uuid) {
      reject(uuid)
    }, function () {
      resolve()
    })
  })
}

function _getWilddogBlockAddPromise (resultBlock) {
  return new Promise(function(resolve, reject) {
    wilddogUp.upload(resultBlock, 'block', function (uuid) {
      reject(uuid)
    }, function () {
      resolve()
    })
  })
}

function _getWilddogBlockAddPromise (resultBlock) {
  return new Promise(function(resolve, reject) {
    wilddogUp.upload(resultBlock, 'block', function (uuid) {
      reject(uuid)
    }, function () {
      resolve()
    })
  })
}

function _getWilddogBlockDelPromise (resultBlock) {
  return wilddogUp.del(resultBlock.uuid)
}

function _getCndPieceAddPromise (resultPiece) {
  return new Promise(function (resolve, reject) {
    upload.upHandle(resultPiece, 3, cloudPath, emailConfig, function (_uuid) {
      reject(_uuid)
    }, function () {
      resolve()
    })
  })
}
