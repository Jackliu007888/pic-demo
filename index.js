var fs = require('fs')
var aesjs = require('aes-js')
var key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  29, 30, 31]

var img, imgBase64, imgArr = [], encryptArr = [], decryptArr = []

img = fs.readFileSync('./src/dddog.jpg')
imgBase64 = img.toString('base64')

// console.log(imgBase64.slice(1, 10))

// 分片

for (var i = 1, len = Math.ceil(imgBase64.length / 10000); i <= len; i++) {
  var temImg = imgBase64.slice((i - 1) * 10000, (i * 10000) < imgBase64.length ? (i * 10000) : imgBase64.length)
  imgArr.push(temImg)
}

for (var i = 0; i < imgArr.length; i++) {
  var encry = encrypt(imgArr[i])
  encryptArr.push(encry)
}

for (var i = 0; i < encryptArr.length; i++) {
  var decry = decrypt(encryptArr[i])
  decryptArr.push(decry)
}
var imgDetail = (function () {
  var element = ''
  for (var i = 0; i < decryptArr.length; i++) {
    element += decryptArr[i]
  }
  return element
})()

// 验证加密解密是否一致
console.log(imgDetail === imgBase64)

if (imgDetail === imgBase64) {
  var base64Data = imgDetail.replace(/^data:image\/jpg;base64,/, '')
  fs.writeFile('./dist/dddog.jpg', base64Data, 'base64', function (err) {
    if (err) console.log(err)
  })
}
function encrypt(text) {
  var textBytes = aesjs.utils.utf8.toBytes(text)
  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5))
  var encryptedBytes = aesCtr.encrypt(textBytes)
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
  return encryptedHex
}

function decrypt(encryptedHex) {
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
  var aesCtr1 = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5))
  var textBytes = aesCtr1.decrypt(encryptedBytes)
  // Convert our bytes back into text
  var decryptedText = aesjs.utils.utf8.fromBytes(textBytes)
  return decryptedText
}

// "Text may be any length you wish, no padding is required."