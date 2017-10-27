var OSS = require('ali-oss')
var co = require('co')
var fs = require('fs')
var jsonData = JSON.parse(fs.readFileSync('./dist/dddog.jpg.json'))

// console.log(jsonData[0])
for (var i = 0; i < jsonData.length; i++) {
  var uuid = jsonData[i].uuid
  var data = jsonData[i].data
  updateFile(uuid, data)
}

function updateFile(uuid, data) {
  var client = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: 'pic-demo'
  })
  co(function* () {
    var result = yield client.put('piece/' + uuid + '.txt', Buffer.from(data))
    console.log(result)
  }, function (err) {
    console.error(err.stack)
  })
}
