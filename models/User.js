var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  username: String,
  email: String,
  password_hash: String,
  primary_locale: String,
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String
  },
  twitter: {
    id: String,
    oauth_token: String,
    oauth_token_secret: String,
    username: String,
    email: String
  },
  google: {
    id: String,
    oauth_token: String,
    email: String,
    username: String,
    firstName: String,
    lastName: String,
  }

}))
