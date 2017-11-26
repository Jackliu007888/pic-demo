var OSS = require('ali-oss')
var co = require('co')
var fs = require('fs')
var email = require('../email/email')
var emailConfig = {}

var ossConfig = {
  region: 'oss-cn-shenzhen',
  bucket: 'pic-demo'
}

function setConfig(args) {
  ossConfig.region = args.region || ossConfig.region
  ossConfig.bucket = args.bucket || ossConfig.bucket
  ossConfig.accessKeyId = args.accessKeyId || ossConfig.accessKeyId
  ossConfig.accessKeySecret = args.accessKeySecret || ossConfig.accessKeySecret
  emailConfig = args.emailConfig
}

function upHandle(jData, times, cloudPath, errMsg, errCb, sucCb) {
  if (times < 0) {
    errHandle(errMsg)
    errCb(jData._uuid)
  } else {
    var client = new OSS(ossConfig)
    co(function* () {
      for (var i = 0; i < jData.data.length; i++) {
        var uuid = jData.data[i].uuid
        var data = jData.data[i].data
        yield client.put(cloudPath + uuid + '.txt', Buffer.from(data))
        // var result = yield client.put(cloudPath + uuid + '.txt', Buffer.from(data))
        // console.log('No.' + i + ' status: ' + result.res.status)
      }
    }).then(function (value) {
      // email.sendEmail(emailConfig, '全部分片上传成功', '上传成功')
      console.log('全部分片上传成功')
      sucCb(jData._uuid)
    }, function (err) {
      console.log('剩余重新上传次数：' + times + '次')
      errMsg = err
      upHandle(jData, --times, cloudPath, errMsg)
    })
  }
}

function errHandle(err) {
  // 写入本地日志
  var date = new Date()
  fs.appendFile(emailConfig.attachments[0].path, date + '\n' + err + '\n', function (err) {
    if (err) console.log(err)
  })
  // 非断网发邮件
  email.sendEmail(emailConfig, err, '上传失败')
  console.error(err.stack)
}

module.exports = {
  upHandle,
  errHandle,
  setConfig
}
