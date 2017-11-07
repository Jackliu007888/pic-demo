/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-07 22:14:44
 */
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/pic-demo', {
  useMongoClient: true
})
mongoose.Promise = global.Promise
var Schema = mongoose.Schema
module.exports = function (jData) {
  var picSchema = new Schema({
    uuid: 'string',
    data: 'string'
  })
  var Pic = mongoose.model('Pic', picSchema)
  // var tempArr = []
  for (var i = 0; i < jData.length; i++) {
    var uuid = jData[i].uuid
    var data = jData[i].data
    var pic = new Pic({
      uuid: uuid,
      data: data
    })
    pic.save(function (err) {
      if (err) console.log(err)
    })
  }
}
