var wilddog = require('wilddog')
var config = {
  syncURL: 'https://wd2184918949wfrbrk.wilddogio.com/'
}

function setConfig(cfg) {
  config.syncURL = cfg.syncURL || config.syncURL
}
wilddog.initializeApp(config)
var ref = wilddog.sync().ref()

function upload(jData, type, scb, ecb) {
  var childNode = ref.child(type)
  if (type === 'piece' && Object.prototype.toString.call(jData.data) === '[object Array]') {
    for (let i = 0; i < jData.data.length; i++) {
      var postsRef = childNode.child(jData.data[i].uuid)
      postsRef.set({
        'data': jData.data[i].data
      }, function (err) {
        if (err) {
          console.log(err)
          ecb(jData._uuid)
        } else {
          scb(jData._uuid)
        }
      })
    }
  } else if (type === 'block' && Object.prototype.toString.call(jData) === '[object Object]') {
    var postsRef = childNode.child(jData.uuid)
    postsRef.set({
      'data': jData.data
    }, function (err) {
      if (err) {
        console.log(err)
        ecb(jData.uuid)
      } else {
        scb(jData.uuid)
      }
    })
  } else {
    console.log('unknown type')
    ecb(jData)
  }
}

module.exports = {
  setConfig,
  upload
}
