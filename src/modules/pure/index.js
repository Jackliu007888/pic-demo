function checkSubfix (str, suffixs) {
  for (var i = 0; i < suffixs.length; i++) {
    var suffix = suffixs[i]
    var temp = str.slice(-suffix.length)
    if (temp === suffix) {
      return true
    }
  }
  return false
}

module.exports = {
  checkSubfix
}
