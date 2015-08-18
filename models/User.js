var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  username: String,
  email: String,
  password_hash: String,
  primary_locale: String
}))
