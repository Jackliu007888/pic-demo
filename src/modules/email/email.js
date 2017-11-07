/*
 * @Author: Jackliu
 * @Date: 2017-10-31 11:33:21
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-03 23:46:36
 */

/*
 *  npm install nodemailer --save
 *  var email = require('./email')
 *  //  usage
 *  // 自定义参数
 *  mailConfig = {
 *    service: string,
 *  // 常用：'Gmail','Hotmail','iCloud','Outlook365','QQ','QQex','163','qiye.aliyun'
 *    port: number                              发送端口
 *    secureConnection: boolean                 是否安全连接
 *    auth: { user: string, pass: string },     邮箱名及密码（密码为第三方授权码）
 *    from: string,                             发件人
 *    to: string,                               收件人
 *    subject: string,                          主题
 *    text: string,                              发送内容
 *    attachments: [{
 *      filename: filename,
 *      path: path
 *    }]
 *  }
 *  // 执行发送
 *  email.sendEmail(mailConfig, text. subject)
 */
var nodemailer = require('nodemailer')

function sendEmail(config, text, subject) {
  var mailOptions = {
    service: config.service || 'QQex',
    port: config.port || 465,
    secureConnection: config.secureConnection || true,
    auth: config.auth || '',
    from: config.from || '',
    to: config.to || '',
    subject: subject || config.subject || '',
    text: text || config.text || '',
    attachments: config.attachments || ''
  }

  var transporter = nodemailer.createTransport({
    service: mailOptions.service,
    port: mailOptions.port,
    secureConnection: mailOptions.secureConnection,
    auth: mailOptions.auth
  })

  transporter.sendMail(mailOptions, function (error, info) {
    // console.log(mailOptions)
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: ' + info.response)
  })
}

module.exports = {
  sendEmail
}
