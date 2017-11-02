var utils = require('./utils.js')

var cfg = {
  debug: false,
  aesjsCounter: 5,
  uuidv5NameSpace: 'd15e78fb-37ff-4265-9ea5-e7a3cbe97192'
}

function config (args) {
  cfg.debug = args.debug || cfg.debug
  cfg.aesjsCounter = args.aesjsCounter || cfg.aesjsCounter
  cfg.uuidv5NameSpace = args.uuidv5NameSpace || cfg.uuidv5NameSpace
}

function encrypt (key, data) {
  return utils.encrypt(cfg, key, data)
}

function decrypt (key, hex) {
  return utils.decrypt(cfg, key, hex)
}

module.exports = {
  config,
  encrypt,
  decrypt
}
