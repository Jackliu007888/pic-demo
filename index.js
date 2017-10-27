var fs = require('fs')

var aesjs = require('aes-js')
var uuidv5 = require('uuid/v5')
var uuidv5NameSpace = 'e43d39ea-c86a-4227-8f7c-66397abbec8b'

var AesMoOCtr = aesjs.ModeOfOperation.ctr
var config = {
  aesjsCounter: 5
}

// TODO:
// 1. 添加强制指定分片，比如强制指定分 10 片，分 100 片
function encrypt (key, file) {
  var tempFile = fs.readFileSync(file)
  var base64 = tempFile.toString('base64')
  var resultArr = []

  for (var i = 1; i <= Math.ceil(base64.length / 5000); i++) {
    var piece = base64.slice((i - 1) * 5000, (i * 5000) < base64.length ? (i * 5000) : base64.length)
    var pieceUuid = uuidv5(piece, uuidv5NameSpace)
    var pieceEncrypt = _encrypt(key, piece)

    resultArr.push({
      uuid: pieceUuid,
      data: pieceEncrypt
    })
  }

  return resultArr
}

function decrypt (key, arr) {
  var temp = ''

  for (var i = 0; i < arr.length; i++) {
    temp += _decrypt(key, arr[i].data)
  }

  return temp
}

module.exports = {
  encrypt,
  decrypt
}

function _encrypt (key, text) {
  var textBytes = aesjs.utils.utf8.toBytes(text)
  var aesCtr = new AesMoOCtr(key, new aesjs.Counter(config.aesjsCounter))
  var encryptedBytes = aesCtr.encrypt(textBytes)
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

  return encryptedHex
}

function _decrypt (key, hex) {
  var encryptedBytes = aesjs.utils.hex.toBytes(hex)
  var aesCtr1 = new AesMoOCtr(key, new aesjs.Counter(config.aesjsCounter))
  var textBytes = aesCtr1.decrypt(encryptedBytes)
  var decryptedText = aesjs.utils.utf8.fromBytes(textBytes)

  return decryptedText
}
