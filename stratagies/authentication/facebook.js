var request = require('request');

function FacebookAuthenticationStrategy(options){

  options.authURL = options.authURL || 'https://www.facebook.com/dialog/oauth';
  options.accessTokenURL = options.accessTokenURL || 'https://graph.facebook.com/v2.3/oauth/access_token';
  options.userProfileURL = options.userProfileURL || 'https://graph.facebook.com/me';

  this._o = options;

}

FacebookAuthenticationStrategy.prototype.createAuthUrl = function(){

  var request_url = this._o.authURL
  + "?client_id=" + this._o.clientID
  + "&scope=email"
  + "&redirect_uri=" + this._o.callbackURL;

  return request_url;
}

FacebookAuthenticationStrategy.prototype.obtainAccessToken = function(code, done) {

  var accessTokenURL = this._o.accessTokenURL
  + '?client_id=' + this._o.clientID
  + '&redirect_uri='  + this._o.callbackURL
  + '&client_secret=' + this._o.clientSecret
  + '&code=' + code



  request(accessTokenURL, function(e, response, body) {

    if(e){
      console.error(e)
      return;
    }

    var data = JSON.parse(body);

    this.addUserProfileInfo(data.token_type, data.access_token, done)

  }.bind(this));

}

FacebookAuthenticationStrategy.prototype.addUserProfileInfo = function(token_type, access_token, done){

  var userProfileURL = this._o.userProfileURL
  + "?access_token="+access_token;

  request.get(userProfileURL, function(e, r, body){
    if(e){
      console.error(e)
      return;
    }

    done(access_token, JSON.parse(body));

  })
}

module.exports = FacebookAuthenticationStrategy;
