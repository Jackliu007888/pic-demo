var config = require('./accessconfig')
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secureConnection: true,
  auth: {
    user: config.emailFrom,
    pass: config.emailPass
  }
})

var mailOptions = {
  from: config.emailFrom,
  to: config.emailTo,
  subject: 'Hello sir',
  text: 'Hello world ?'
}

function mailConfig(args) {
  mailOptions.from = args.from || mailOptions.from
  mailOptions.to = args.to || mailOptions.to
  mailOptions.subject = args.subject || mailOptions.subject
  mailOptions.text = args.text || mailOptions.text
}

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