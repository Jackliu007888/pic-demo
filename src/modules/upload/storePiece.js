/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-23 00:44:02
 */
var utils = require('./utils')

var Pic = utils.Pic

function add(jData) {
  if (Object.prototype.toString.call(jData) === '[object Array]') {
    var isSuccess = true
    for (var i = 0; i < jData.length; i++) {
      Pic.findOneAndUpdate({
        uuid: jData[i].uuid
      }, {
        uuid: jData[i].uuid,
        data: jData[i].data
      }, {
        upsert: true
      }, function (err) {
        if (err) {
          isSuccess = false
          console.log(err)
        } else {
          // console.log('piece update success!')
        }
      })
    }
    if (isSuccess) {
      console.log('多分片存储完成')
    } else {
      console.log('多分片存储失败')
    }
  } else if (Object.prototype.toString.call(jData) === '[object Object]') {
    Pic.findOneAndUpdate({
      uuid: jData.uuid
    }, {
      uuid: jData.uuid,
      data: jData.data
    }, {
      upsert: true
    }, function (err) {
      if (err) console.log(err)
      console.log('piece update success!')
    })
  } else {
    console.log('unknown type!')
  }
}

function del(jData) {
  if (Object.prototype.toString.call(jData) === '[object Array]') {
    for (var i = 0; i < jData.length; i++) {
      Pic.remove({
        uuid: jData[i].uuid
      }, function (err) {
        if (err) console.log(err)
        console.log('piece delete success!')
      })
    }
  } else if (Object.prototype.toString.call(jData) === '[object Object]') {
    Pic.remove({
      uuid: jData.uuid
    }, function (err) {
      if (err) console.log(err)
      console.log('piece delete success!')
    })
  }
}

function search(uuid, cb) {
  Pic.find({
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
