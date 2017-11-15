var wilddog = require('wilddog')
var data = require('../../../dist/dddog.jpg.block.json')
var config = {
  syncURL: 'https://wd2184918949wfrbrk.wilddogio.com/'
}

function setConfig(cfg) {
  config.syncURL = cfg.syncURL || config.syncURL
}
wilddog.initializeApp(config)
var ref = wilddog.sync().ref()

function writeData(jData) {
  var list = ref.child('list')
  var array = []
  array[0] = 'a'
  array[2] = 'b'
  array[3] = 'c'
  array[5] = 'd'
  list.set(array)
  ref.on('value', function (snapshot) {
    console.log(snapshot.val())
  })
}

writeData(data)
module.exports = {
  setConfig,
  writeData
}
