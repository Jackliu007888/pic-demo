var config = require('./config.json')
var jsonData = require('../dist/dddog.jpg.piece.json')
var upload = require('./modules/upload/upload')
var store = require('./modules/upload/store')
var cloudPath = 'piece/'
var emailConfig = {
  service: 'QQex',
  auth: {
    user: config.upconfig.emailFrom,
    pass: config.upconfig.emailPass
  },
  from: config.upconfig.emailFrom,
  to: config.upconfig.emailTo,
  subject: 'Hello sir',
  text: 'Hello sir',
  attachments: [{
    filename: 'log',
    path: './dist/log.txt'
  }]
}
upload.setConfig({
  accessKeyId: config.upconfig.accessKeyId,
  accessKeySecret: config.upconfig.accessKeySecret,
  emailConfig: emailConfig
})

// args: 分片数据、重传次数、云端文件夹、错误信息、邮箱设置
upload.upHandle(jsonData.data, 3, cloudPath, '', emailConfig)

store(jsonData.data)