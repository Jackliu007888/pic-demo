var fs = require('fs')

var aesjs = require('aes-js')
var uuidv5 = require('uuid/v5')

var AesMoOCtr = aesjs.ModeOfOperation.ctr
var cfg = {
  debug: false,
  aesjsCounter: 5,
  uuidv5NameSpace: 'e43d39ea-c86a-4227-8f7c-66397abbec8b'
}

function config (args) {
  cfg.debug = args.debug || cfg.debug
  cfg.aesjsCounter = args.aesjsCounter || cfg.aesjsCounter
  cfg.uuidv5NameSpace = args.uuidv5NameSpace || cfg.uuidv5NameSpace
}

function encrypt (key, file, minCount, maxLength) {
  minCount = minCount || 10
  maxLength = maxLength || 1000 * 100

  var rate = 2
  var tempFile = fs.readFileSync(file)
  var base64 = tempFile.toString('base64')
  var pieceLength = Math.ceil(base64.length / minCount)
  var resultFile = {
    _file: file,
    uuid: uuidv5(_encrypt(key, file), cfg.uuidv5NameSpace),
    data: []
  }
  var resultPiece = {
    _uuid: resultFile.uuid,
    data: []
  }

  pieceLength = pieceLength <= (maxLength / rate) ? pieceLength : (maxLength / rate)
  for (var i = 1; i <= Math.ceil(base64.length / pieceLength); i++) {
    var piece = base64.slice((i - 1) * pieceLength,
      (i * pieceLength) < base64.length ? (i * pieceLength) : base64.length)
    var pieceEncrypt = _encrypt(key, piece)
    var pieceUuid = uuidv5(pieceEncrypt, cfg.uuidv5NameSpace)

    resultFile.data.push(pieceUuid)
    resultPiece.data.push({
      uuid: pieceUuid,
      data: cfg.debug ? pieceEncrypt.length : pieceEncrypt
    })
  }

  resultFile.data = resultFile.data.join(',')
  resultPiece.data = _shuffle(resultPiece.data)

  return {
    resultFile,
    resultPiece
  }
}

function decrypt (key, arr, map) {
  var temp = ''

  for (var i = 0; i < map.length; i++) {
    temp += _decrypt(key, _get(map[i]))
  }

  function _get (uuid) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].uuid === uuid) {
        return arr[i].data
      }
    }
  }

  return temp
}

module.exports = {
  config,
  encrypt,
  decrypt
}

function _encrypt (key, text) {
  var textBytes = aesjs.utils.utf8.toBytes(text)
  var aesCtr = new AesMoOCtr(key, new aesjs.Counter(cfg.aesjsCounter))
  var encryptedBytes = aesCtr.encrypt(textBytes)
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

  return encryptedHex
}

function _decrypt (key, hex) {
  var encryptedBytes = aesjs.utils.hex.toBytes(hex)
  var aesCtr1 = new AesMoOCtr(key, new aesjs.Counter(cfg.aesjsCounter))
  var textBytes = aesCtr1.decrypt(encryptedBytes)
  var decryptedText = aesjs.utils.utf8.fromBytes(textBytes)

  return decryptedText
}

function _shuffle (arr) {
  for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr
}
