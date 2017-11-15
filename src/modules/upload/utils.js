/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-16 00:26:56
 */
var mongoose = require('mongoose')

function connectDb(params) {
  var db = mongoose.connect('mongodb://localhost/pic-demo', {
    useMongoClient: true
  })
  db.on('error', function () {
    console.log('Connection error')
  })
  db.once('open', function () {
    console.log('Mongo working!')
  })
  db.on('close', function () {
    console.log('Connection close')
  })

  return db
}
var Schema = mongoose.Schema
var blockSchema = new Schema({
  uuid: 'string',
  data: 'string'
})
var picSchema = new Schema({
  uuid: 'string',
  data: 'string'
})
var Block = mongoose.model('Block', blockSchema)
var Pic = mongoose.model('Pic', picSchema)

module.exports = {
  connectDb,
  Pic,
  Block
}
