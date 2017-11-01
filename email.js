/*
 * @Author: Jackliu
 * @Date: 2017-10-31 11:33:21
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-10-31 17:09:58
 */

/* 
 *  npm install nodemailer --save
 *  var email = require('./email')
 *  //  usage 
 *  // 自定义参数
 *  email.mailConfig({
 *    service: string,   
 *  // 常用：'Gmail','Hotmail','iCloud','Outlook365','QQ','QQex','163','qiye.aliyun'
 *    port: number                              发送端口          
 *    secureConnection: boolean                 是否安全连接
 *    auth: { user: string, pass: string },     邮箱名及密码（密码为第三方授权码）
 *    from: string,                             发件人
 *    to: string,                               收件人
 *    subject: string,                          主题
 *    text: string                              发送内容        
 *  })
 *  // 执行发送
 *  email.sendEmail()
 */

var config = require('./accessconfig')
var nodemailer = require('nodemailer')

var mailOptions = {
  // \node_modules\nodemailer\lib\well-known\services.json
  service: 'QQex',
  port: 465,
  secureConnection: true,
  auth: {
    user: config.emailFrom,
    pass: config.emailPass
  },
  from: config.emailFrom,
  to: config.emailTo,
  subject: 'Hello sir',
  text: 'Hello world ?',
  attachments: [{
    filename: 'log.txt',
    path: './src/log.txt'
  }]
}

function mailConfig(args) {
  mailOptions.service = args.service || mailOptions.service
  mailOptions.port = args.port || mailOptions.port
  mailOptions.secureConnection = args.secureConnection || mailOptions.secureConnection
  mailOptions.auth = args.auth || mailOptions.auth
  mailOptions.from = args.from || mailOptions.from
  mailOptions.to = args.to || mailOptions.to
  mailOptions.subject = args.subject || mailOptions.subject
  mailOptions.text = args.text || mailOptions.text
}

function sendEmail() {
  console.log(mailOptions)
  var transporter = nodemailer.createTransport({
    service: mailOptions.service,
    port: mailOptions.port,
    secureConnection: mailOptions.secureConnection,
    auth: mailOptions.secureConnection
  })
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: ' + info.response)
  })
}

module.exports = {
  sendEmail,
  mailConfig
}
