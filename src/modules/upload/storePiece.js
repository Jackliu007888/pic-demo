/*
 * @Author: Jackliu
 * @Date: 2017-11-06 21:29:56
 * @Last Modified by: Jackliu
 * @Last Modified time: 2017-11-24 23:41:46
 */
var utils = require('./utils')

var Pic = utils.Pic

function add(jData, scb, ecb) {
  if (Object.prototype.toString.call(jData.data) === '[object Array]') {
    var isSuccess = true
    for (var i = 0; i < jData.data.length; i++) {
      Pic.findOneAndUpdate({
        uuid: jData.data[i].uuid
      }, {
        uuid: jData.data[i].uuid,
        data: jData.data[i].data
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
      return scb(jData._uuid)
    } else {
      console.log('多分片存储失败')
      return ecb(jData._uuid)
    }
  } else if (Object.prototype.toString.call(jData.data) === '[object Object]') {
    Pic.findOneAndUpdate({
      uuid: jData.data.uuid
    }, {
      uuid: jData.data.uuid,
      data: jData.data.data
    }, {
      upsert: true
    }, function (err) {
      if (err) console.log(err)
      console.log('piece update success!')
      return scb(jData._uuid)
    })
  } else {
    console.log('unknown type!')
    return ecb(jData._uuid)
  }
}

function del(jData, scb, ecb) {
  if (Object.prototype.toString.call(jData.data) === '[object Array]') {
    for (var i = 0; i < jData.data.length; i++) {
      Pic.remove({
        uuid: jData.data[i].uuid
      }, function (err) {
        if (err) {
          console.log(err)
          return ecb(jData._uuid)
        } else {
          console.log('piece delete success!')
          return scb(jData._uuid)
        }
      })
    }
  } else if (Object.prototype.toString.call(jData.data) === '[object Object]') {
    Pic.remove({
      uuid: jData.data.uuid
    }, function (err) {
      if (err) {
        console.log(err)
        return scb(jData._uuid)
      } else {
        console.log('piece delete success!')
        return scb(jData._uuid)
      }
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
