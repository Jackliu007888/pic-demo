var config = require('./config.json')
var jsonDataPiece = require('../dist/dddog.jpg.piece.json')
var jsonDataBlock = require('../dist/dddog.jpg.block.json')
var upload = require('./modules/upload/upload')
var storeBlock = require('./modules/upload/storeBlock')
var storePiece = require('./modules/upload/storePiece')
var wilddogUp = require('./modules/upload/wilddogUp.js')

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
// upload.upHandle(jsonDataPiece.data, 3, cloudPath, '', emailConfig)

storeBlock.del(jsonDataBlock)
storePiece.search(jsonDataPiece.data[1].uuid, function (params) {
  console.log(params)
  require('./modules/upload/utils').connectDb().close()
})

wilddogUp.upload(jsonDataBlock, 'block')
