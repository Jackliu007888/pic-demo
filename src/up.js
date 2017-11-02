var config = require('./config.json')
var email = require('./modules/upload/email')

email.mailConfig({
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
    filename: 'file',
    path: './src/config.json'
  }]

})
email.sendEmail()
