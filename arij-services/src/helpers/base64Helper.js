var base64 = require('base-64');
var utf8   = require('utf8');

function Base64Helper(string) {
  var bytes = utf8.encode(string);
  var encoded = base64.encode(bytes);
  return encoded;
}

module.exports = Base64Helper;
