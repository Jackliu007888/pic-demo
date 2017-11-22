var fs = require('fs')
var path = require('path')

var rootPath = path.join(__dirname, '../../../')

var cfg = {
  lock: path.join(rootPath, '.lock')
}

function config (args) {
  cfg.lock = args.lock || cfg.lock
}

function check () {
  return fs.existsSync(cfg.lock)
}

function lock (content) {
  return fs.writeFileSync(cfg.lock, content)
}

function unlock () {
  return fs.unlinkSync(cfg.lock)
}

module.exports = {
  config,
  check,
  lock,
  unlock
}
