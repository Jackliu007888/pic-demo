var OSS = require('ali-oss')
var co = require('co')
var client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAIZXrbK00FsSw5',
  accessKeySecret: '1y8tFChozeWdnUDYdQHijBZYRIrqQu',
  bucket: 'pic-demo'
})

co(function* () {
  var result = yield Promise.resolve(true)
  return result
}).then(function (value) {
  console.log(value)
}, function (err) {
  console.error(err.stack)
})