var fs = require('fs')
var path = require('path')
var Promise = require('promise-polyfill')

var configJson = require('../../config.json')
var pure = require('../../modules/pure/index.js')
var encryptUtils = require('../../modules/cryptology/utils.js')
var pieceEncrypt = require('../../modules/cryptology/piece.js')
var blockEncrypt = require('../../modules/cryptology/block.js')
var modelPic = require('../../models/pic.js')

var keyA = encryptUtils.generateKey(configJson.cryptology.keyA.secret, configJson.cryptology.keyA.salt)
var keyB = encryptUtils.generateKey(configJson.cryptology.keyB.secret, configJson.cryptology.keyB.salt)
var rootPath = path.join(__dirname, '../../../')
var cfg = {
  path: path.join(rootPath, 'temp'),
  targetSuffixs: ['.jpg', '.jpeg', '.png'],
  jsonSuffixs: ['.json']
}
var stopped = false

pieceEncrypt.config({
  uuidv5NameSpace: configJson.cryptology.piece.uuidv5NameSpace
})
blockEncrypt.config({
  uuidv5NameSpace: configJson.cryptology.block.uuidv5NameSpace
})

function config (args) {
  cfg.path = args.path
  cfg.targetSuffixs = args.targetSuffixs
  cfg.jsonSuffixs = args.jsonSuffixs
}

function start (callback) {
  if (stopped) {
    console.log('jobs/main: stopped with error')
    callback()
    return
  }
  var encryptResultList = []
  var handlePromiseList = []
  var files = fs.readdirSync(cfg.path)
  var targetFiles = []
  var targetJson = []

  for (let i = 0; i < files.length; i++) {
    if (pure.checkSubfix(files[i], cfg.targetSuffixs)) {
      targetFiles.push(files[i])
    }
    if (pure.checkSubfix(files[i], cfg.jsonSuffixs)) {
      targetJson.push(files[i])
    }
  }

  if (!targetFiles.length && !targetJson.length) {
    console.log('jobs/main: target files empty')
    callback()
    return
  }

  targetJson.forEach(function (file) {
    // todo 加密上传删除
    console.log(file)
    var jsonData = JSON.parse(fs.readFileSync(path.join(cfg.path, file)))
    var encryptRes = {}
    encryptRes.data = blockEncrypt.encrypt(keyB, JSON.stringify(jsonData.data))
    encryptRes.uuid = file.slice(0, -5)
    console.log(encryptRes)
    // console.log(encryptResList)
    var tempPro = _getHandlePro(encryptRes)
    tempPro
      .then(function () {
        console.log('jobs/main: handle info success ', encryptRes.uuid)
        fs.unlinkSync(path.join(cfg.path, file))
      })
      .catch(function (err) {
        console.log('jobs/main: handle info faild', err)
        stopped = true
        return Promise.resolve()
      })
    handlePromiseList.push(tempPro)
  })

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
function _getHandlePro (encryptRes) {
  return new Promise((resolve, reject) => {
    modelPic.addInfo(encryptRes)
      .then(function () {
        resolve(encryptRes.uuid)
      }).catch(function (err) {
        reject(encryptRes.uuid)
        console.log('jobs/main: modelPic info faild', err)
      })
  })
}

function _getHandlePromise (encryptResult) {
  return new Promise((resolve, reject) => {
    modelPic.add(encryptResult)
      .then(function () {
        resolve(encryptResult.resultBlock.uuid)
      })
      .catch(function (err) {
        console.log('jobs/main: modelPic add faild', err)
        modelPic.del(encryptResult)
          .then(function () {
            reject(encryptResult.resultBlock.uuid)
          })
          .catch(function (err) {
            console.log('jobs/main: modelPic del faild', err)
            console.log('jobs/main: stopped')
            stopped = true
          })
      })
  })
}
