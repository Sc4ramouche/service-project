Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj, null, 2))
}
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key))
}