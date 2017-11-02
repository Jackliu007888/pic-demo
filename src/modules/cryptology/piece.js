var fs = require('fs')

var uuidv5 = require('uuid/v5')
var utils = require('./utils.js')

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
  var resultBlock = {
    _file: file,
    uuid: uuidv5(utils.encrypt(cfg, key, file), cfg.uuidv5NameSpace),
    data: []
  }
  var resultPiece = {
    _uuid: resultBlock.uuid,
    data: []
  }

  pieceLength = pieceLength <= (maxLength / rate) ? pieceLength : (maxLength / rate)
  for (var i = 1; i <= Math.ceil(base64.length / pieceLength); i++) {
    var piece = base64.slice((i - 1) * pieceLength,
      (i * pieceLength) < base64.length ? (i * pieceLength) : base64.length)
    var pieceEncrypt = utils.encrypt(cfg, key, piece)
    var pieceUuid = uuidv5(pieceEncrypt, cfg.uuidv5NameSpace)

    resultBlock.data.push(pieceUuid)
    resultPiece.data.push({
      uuid: pieceUuid,
      data: cfg.debug ? pieceEncrypt.length : pieceEncrypt
    })
  }

  resultBlock.data = resultBlock.data.join(',')
  resultPiece.data = utils.shuffle(resultPiece.data)

  return {
    resultBlock,
    resultPiece
  }
}

function decrypt (key, arr, map) {
  var temp = ''

  for (var i = 0; i < map.length; i++) {
    var tempPiece = _get(map[i])
    if (!tempPiece) {
      return false
    }
    temp += utils.decrypt(cfg, key, _get(map[i]))
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
