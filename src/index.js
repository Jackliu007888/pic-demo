var schedule = require('node-schedule')
var jobMain = require('./jobs/main/index.js')
var locker = require('./modules/locker/index.js')

var rule = {}
var times = []
for (var i = 0; i < 60; i = i + 10) {
  times.push(i)
}

rule.second = times

locker.unlock()

schedule.scheduleJob(rule, function () {
  if (locker.check()) {
    console.log('pic-demo: locked')
  } else {
    locker.lock()
    console.log('pic-demo: todo job main')
    jobMain.start(function () {
      console.log('pic-demo: job main done')
      console.log('-------------------------------------------------------------')
      locker.unlock()
    })
  }
})
