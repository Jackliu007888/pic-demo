var schedule = require('node-schedule')
var locker = require('./modules/locker/index.js')

var rule = {}
var times = []
for (var i = 1; i < 60; i++) {
  times.push(i)
}

rule.second = times

locker.unlock()

schedule.scheduleJob(rule, function() {
  if (locker.check()) {
    console.log('locked')
  } else {
    locker.lock()
    console.log('Todo')
    setTimeout(function () {
      console.log('Todo done')
      locker.unlock()
    }, 3000)
  }
})
