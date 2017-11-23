var fs = require('fs')
var path = require('path')
var Promise = require('promise-polyfill')

var config = require('../../config.json')
var pure = require('../../modules/pure/index.js')
var encryptUtils = require('../../modules/cryptology/utils.js')
var pieceEncrypt = require('../../modules/cryptology/piece.js')
var blockEncrypt = require('../../modules/cryptology/block.js')

var storeBlock = require('../../modules/upload/storeBlock')
var storePiece = require('../../modules/upload/storePiece')
var wilddogUp = require('../../modules/upload/wilddogUp.js')
var upload = require('../../modules/upload/upload')

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
var keyA = encryptUtils.generateKey(config.cryptology.keyA.secret, config.cryptology.keyA.salt)
var keyB = encryptUtils.generateKey(config.cryptology.keyB.secret, config.cryptology.keyB.salt)
var rootPath = path.join(__dirname, '../../../')
var cfg = {
  path: path.join(rootPath, 'temp'),
  targetSuffixs: ['.jpg', '.jpeg']
}

upload.setConfig({
  accessKeyId: config.upconfig.accessKeyId,
  accessKeySecret: config.upconfig.accessKeySecret,
  emailConfig: emailConfig
})
pieceEncrypt.config({
  uuidv5NameSpace: config.cryptology.piece.uuidv5NameSpace
})
blockEncrypt.config({
  uuidv5NameSpace: config.cryptology.block.uuidv5NameSpace
})

function config (args) {
  cfg.path = args.path
  cfg.targetSuffixs = args.targetSuffixs
}

function start (callback) {
  var encryptResultList = []
  var handlePromiseList = []
  var files = fs.readdirSync(cfg.path)
  var targetFiles = []

  for (var i = 0; i < files.length; i++) {
    if (pure.checkSubfix(files[i], cfg.targetSuffixs)) {
      targetFiles.push(files[i])
    }
  }
  if (!targetFiles.length) {
    console.log('jobs/main: target files empty')
    callback()
    return
  }

  targetFiles.forEach(function (file) {
    var encryptResult =
      pieceEncrypt.encrypt(keyA, path.join(cfg.path, file))
    encryptResult.resultBlock.data =
      blockEncrypt.encrypt(keyB, encryptResult.resultBlock.data)
    var tempPromise = _getHandlePromise(encryptResult)

    encryptResultList.push(encryptResult)
    tempPromise
      .then(function (uuid) {
        var temp = _getFilePathByUuid(uuid)
        fs.unlinkSync(temp)
        console.log('jobs/main: handle success', temp)
      })
      .catch(function (uuid) {
        var temp = _getFilePathByUuid(uuid)
        console.log('jobs/main: handle faild', temp)

        return Promise.resolve()
      })
    handlePromiseList.push(tempPromise)
  })

  Promise.all(handlePromiseList)
    .then(function (values) {
      callback()
    })

  function _getFilePathByUuid (uuid) {
    for (var i = 0; i < encryptResultList.length; i++) {
      var item = encryptResultList[i]
      if (item.resultBlock.uuid === uuid) {
        return item.resultBlock['_file']
      }
    }
  }
}

module.exports = {
  config,
  start
}

// TODO
function _getHandlePromise (encryptResult) {
  return new Promise((resolve, reject) => {
    // do upload
    wilddogUp.upload(encryptResult.resultBlock, 'block')
    wilddogUp.upload(encryptResult.resultPiece.data, 'piece')
    upload.upHandle(encryptResult.resultPiece.data, 3, cloudPath, emailConfig)
    storePiece.add(encryptResult.resultPiece.data)
    storeBlock.add(encryptResult.resultBlock)
    // upload success
    resolve(encryptResult.resultBlock.uuid)
    // upload failed
    reject(encryptResult.resultBlock.uuid)
  })
}
