var aesjs = require('aes-js')
var crypto = require('crypto')

var AesMoOCtr = aesjs.ModeOfOperation.ctr

function encrypt (cfg, key, text) {
  var textBytes = aesjs.utils.utf8.toBytes(text)
  var aesCtr = new AesMoOCtr(key, new aesjs.Counter(cfg.aesjsCounter))
  var encryptedBytes = aesCtr.encrypt(textBytes)
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

  return encryptedHex
}

function decrypt (cfg, key, hex) {
  var encryptedBytes = aesjs.utils.hex.toBytes(hex)
  var aesCtr1 = new AesMoOCtr(key, new aesjs.Counter(cfg.aesjsCounter))
  var textBytes = aesCtr1.decrypt(encryptedBytes)
  var decryptedText = aesjs.utils.utf8.fromBytes(textBytes)

  return decryptedText
}

function shuffle (arr) {
  for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr
}

function shuffle2 (arr) {
  for (var j, x, i = arr.length, m = arr.length / 2; i; j = parseInt(Math.random() * m * 2), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr
}

function generateKey (secret, salt, options) {
  options = options || {}
  options.iterations = options.iterations || 100000
  options.keyBit = options.keyBit || 256
  options.digest = options.digest || 'sha512'

  return crypto.pbkdf2Sync(secret, salt, options.iterations, options.keyBit / 8, options.digest)
}

module.exports = {
  encrypt,
  decrypt,
  shuffle,
  shuffle2,
  generateKey
}
