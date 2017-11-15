/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-16 00:26:17
 */
var utils = require('./utils')

utils.connectDb()
var Block = utils.Block

function add(jData) {
  Block.findOneAndUpdate({
    uuid: jData.uuid
  }, {
    uuid: jData.uuid,
    data: jData.data
  }, {
    upsert: true
  }, function (err) {
    if (err) console.log(err)
    console.log('block update success')
  })
}

function del(jData) {
  Block.remove({
    uuid: jData.uuid
  }, function (err) {
    if (err) console.log(err)
    console.log('block delete success!')
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
