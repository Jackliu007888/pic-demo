var OSS = require('ali-oss')
var co = require('co')
var fs = require('fs')
var config = require('./accessconfig')
var email = require('./email')
var jsonData = JSON.parse(fs.readFileSync('./dist/dddog.jpg.json'))
var uploadErr = false
var upNode = 0

upHandle(jsonData.data, {}, uploadErr, upNode)

function upHandle(data, argcfg, uploadErr, upNode) {
  var client = new OSS({
    region: argcfg.region || config.region,
    accessKeyId: argcfg.accessKeyId || config.accessKeyId,
    accessKeySecret: argcfg.accessKeySecret || config.accessKeySecret,
    bucket: argcfg.bucket || config.bucket
  })
  co(function* () {
    for (var i = upNode; i < jsonData.data.length; i++) {
      var uuid = jsonData.data[i].uuid
      var data = jsonData.data[i].data
      var result = yield client.put('piece/' + uuid + '.txt', Buffer.from(data))
      console.log(result)
      upNode = i
    }
  }).then(function (value) {
    console.log('全部分片上传成功')
  }, function (err) {
    errHandle(err)
  })
}

function errHandle(err) {
  // 写入本地日志
  uploadErr = true
  var date = new Date()
  fs.appendFile('./src/message.txt', date + '\n' + err.stack + '\n', function (err) {
    if (err) console.log(err)
  })
  // 非断网发邮件
  email.mailConfig({
    subject: '分片上传出错!',
    text: err.stack
  })
  email.sendEmail()
  console.error(err.stack)
}