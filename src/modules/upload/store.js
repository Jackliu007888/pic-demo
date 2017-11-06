/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-06 23:56:25
 */
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/pic-demo', {
  useMongoClient: true
})
mongoose.Promise = global.Promise
var Schema = mongoose.Schema
module.exports = function (jData) {
  var childSchema = new Schema({
    uuid: 'string',
    data: 'string'
  })

  var parentSchema = new Schema({
    // Array of subdocuments
    data: [childSchema],
    _uuid: 'string'
    // child: childSchema
  })
  var Pic = mongoose.model('Pic', parentSchema)
  var tempArr = []
  for (var i = 0; i < jData.data.length; i++) {
    var uuid = jData.data[i].uuid
    var data = jData.data[i].data
    tempArr.push({
      uuid: uuid,
      data: data
    })
  }
  var demo = new Pic({
    _uuid: jData._uuid,
    data: tempArr
  })
  demo.save(function (err) {
    if (err) console.log(err)
  })
}
