function checkSubfix (str, suffixs) {
  for (var i = 0; i < suffixs.length; i++) {
    var suffix = str[i]
    var temp = str.substring(str.length - suffix.length, str.length)

    if (temp === suffix) {
      return true
    }
  }
  return false
}

module.exports = {
  checkSubfix
}
