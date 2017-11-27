var fs = require('fs')
var path = require('path')

var config = require('./config.json')
var encryptUtils = require('./modules/cryptology/utils.js')
var pieceEncrypt = require('./modules/cryptology/piece.js')
var blockEncrypt = require('./modules/cryptology/block.js')

var keyA = encryptUtils.generateKey(config.cryptology.keyA.secret, config.cryptology.keyA.salt)
var keyB = encryptUtils.generateKey(config.cryptology.keyB.secret, config.cryptology.keyB.salt)
console.log(keyA.toString('hex'), keyB.toString('hex'))
var encryptResult = ''
var decryptResult = ''

pieceEncrypt.config({
  uuidv5NameSpace: config.cryptology.piece.uuidv5NameSpace
})

blockEncrypt.config({
  uuidv5NameSpace: config.cryptology.block.uuidv5NameSpace
})

encrypt()
function encrypt () {
  encryptResult = pieceEncrypt.encrypt(keyA, path.join(__dirname, '/assets/dddog.jpg'))
  encryptResult.resultBlock.data = blockEncrypt.encrypt(keyB, encryptResult.resultBlock.data)
  fs.writeFile(path.join(__dirname, '../dist/dddog.jpg.piece.json'), JSON.stringify(encryptResult.resultPiece), function (err) {
    if (err) console.log(err)
  })
  fs.writeFile(path.join(__dirname, '../dist/dddog.jpg.block.json'), JSON.stringify(encryptResult.resultBlock), function (err) {
    if (err) console.log(err)
  })
}

decrypt()
function decrypt () {
  // var keyA = encryptUtils.generateKey(config.cryptology.keyA.secret + '1', config.cryptology.keyA.salt + '2')
  // var keyB = encryptUtils.generateKey(config.cryptology.keyB.secret + '1', config.cryptology.keyB.salt + '2')

  decryptResult = {
    resultBlock: {
      _file: encryptResult.resultBlock._file,
      uuid: encryptResult.resultBlock.uuid,
      data: blockEncrypt.decrypt(keyB, encryptResult.resultBlock.data)
    },
    resultPiece: {
      _uuid: encryptResult.resultBlock.uuid
    }
  }
  decryptResult.resultPiece.data = pieceEncrypt.decrypt(keyA, encryptResult.resultPiece.data, decryptResult.resultBlock.data.split(','))
  fs.writeFile(path.join(__dirname, '../dist/dddog.jpg'), decryptResult.resultPiece.data, 'base64', function (err) {
    if (err) console.log(err)
  })
}
