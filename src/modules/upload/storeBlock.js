/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-27 23:36:27
 */
var utils = require('./utils')

utils.connectDb()
var Block = utils.Block

function add (jData, errCb, sucCb) {
  Block.findOneAndUpdate({
    uuid: jData.uuid
  }, {
    uuid: jData.uuid,
    data: jData.data
  }, {
    upsert: true
  }, function (err) {
    if (err) {
      errCb(jData.uuid)
    } else {
      sucCb(jData.uuid)
    }
  })
}

function del (jData, errCb, sucCb) {
  Block.remove({
    uuid: jData.uuid
  }, function (err) {
    if (err) {
      console.log(err)
      errCb(jData.uuid)
    } else {
      console.log('block delete success!')
      sucCb(jData.uuid)
    }
  })
}

function search (uuid, cb) {
  Block.find({
    uuid: uuid
  }, function (err, doc) {
    if (err) console.log(err)
    cb(doc)
  })
}

module.exports = {
  add,
  del,
  search
}
