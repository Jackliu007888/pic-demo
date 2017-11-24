/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-23 23:27:27
 */
var utils = require('./utils')

utils.connectDb()
var Block = utils.Block

function add(jData, scb, ecb) {
  Block.findOneAndUpdate({
    uuid: jData.uuid
  }, {
    uuid: jData.uuid,
    data: jData.data
  }, {
    upsert: true
  }, function (err) {
    if (err) {
      return ecb(jData.uuid)
    } else {
      return scb(jData.uuid)
    }
  })
}

function del(jData, scb, ecb) {
  Block.remove({
    uuid: jData.uuid
  }, function (err) {
    if (err) {
      console.log(err)
      return ecb(jData.uuid)
    } else {
      console.log('block delete success!')
      return scb(jData.uuid)
    }
  })
}

function search(uuid, cb) {
  Block.find({
    uuid: uuid
  }, function (err, doc) {
    if (err) console.log(err)
    return cb(doc)
  })
}

module.exports = {
  add,
  del,
  search
}
