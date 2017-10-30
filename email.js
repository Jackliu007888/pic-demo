var config = require('./accessconfig')
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465, // SMTP 端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: config.emailFrom,
    // 这里密码不是qq密码，是你设置的smtp密码
    pass: config.emailPass
  }
})

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
  from: config.emailFrom,
  to: config.emailTo,
  subject: 'Hello sir',
  text: 'Hello world ?'
}
function mailConfig (args) {
  mailOptions.from = args.from || mailOptions.from
  mailOptions.to = args.to || mailOptions.to
  mailOptions.subject = args.subject || mailOptions.subject
  mailOptions.text = args.text || mailOptions.text
}

// send mail with defined transport object
function sendEmail() {
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