var wilddog = require('wilddog')
var pieceJsonData = require('../../../dist/dddog.jpg.piece.json')
var blockJsonData = require('../../../dist/dddog.jpg.block.json')
var config = {
  syncURL: 'https://wd2184918949wfrbrk.wilddogio.com/'
}

function setConfig(cfg) {
  config.syncURL = cfg.syncURL || config.syncURL
}
wilddog.initializeApp(config)
var ref = wilddog.sync().ref()

function upload(jData, type) {
  var childNode = ref.child(type)
  if (Object.prototype.toString.call(jData) === '[object Array]') {
    for (let i = 0; i < jData.length; i++) {
      var postsRef = childNode.child(jData[i].uuid)
      postsRef.set({
        'data': jData[i].data
      })
      postsRef.on('value', function (val) {
        console.log(val.val())
      })
    }
  } else if (Object.prototype.toString.call(jData) === '[object Object]') {
    var postsRef = childNode.child(jData.uuid)
    postsRef.set({
      'data': jData.data
    })
    postsRef.on('value', function (val) {
      console.log(val.val())
    })
  } else {
    console.log('unknown type')
  }
}

// upload(pieceJsonData.data, 'piece')
upload(blockJsonData, 'block')
module.exports = {
  setConfig,
  upload
}
