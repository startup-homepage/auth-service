var OAuth = require('oauth').OAuth;


function TwitterAuthenticationStrategy(options) {

  options.callbackURL = options.callbackURL;
  options.requestTokenURL = options.requestTokenURL || 'https://api.twitter.com/oauth/request_token';
  options.accessTokenURL = options.accessTokenURL || 'https://api.twitter.com/oauth/access_token';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://api.twitter.com/oauth/authenticate';
  options.userProfileURL = options.userProfileURL || 'https://api.twitter.com/1.1/users/show.json';

  if (!options.requestTokenURL) { throw new TypeError('OAuthStrategy requires a requestTokenURL option'); }
  if (!options.accessTokenURL) { throw new TypeError('OAuthStrategy requires a accessTokenURL option'); }
  if (!options.userAuthorizationURL) { throw new TypeError('OAuthStrategy requires a userAuthorizationURL option'); }
  if (!options.consumerKey) { throw new TypeError('OAuthStrategy requires a consumerKey option'); }
  if (options.consumerSecret === undefined) { throw new TypeError('OAuthStrategy requires a consumerSecret option'); }

  this._o = options;
  this.initOAuth();

}

TwitterAuthenticationStrategy.prototype.initOAuth = function(){

  var _o = this._o;
  this._oauth = new OAuth(_o.requestTokenURL,
                          _o.accessTokenURL,
                          _o.consumerKey,
                          _o.consumerSecret,
                          '1.0',
                          null,
                          _o.signatureMethod || 'HMAC-SHA1',
                          null,
                          _o.customHeaders);

  return this;
}

TwitterAuthenticationStrategy.prototype.sendValidUserAuthorizationURL = function(res){

  this.getValidUserAuthorizationURL(function(token){

    res.json({authentication_url:this._o.userAuthorizationURL + '?oauth_token=' + token});

  }.bind(this))

}


TwitterAuthenticationStrategy.prototype.getValidUserAuthorizationURL = function(tokenCallback){

  this._oauth.getOAuthRequestToken({}, function(err, token, tokenSecret, params) {

    if (err) { return self.error(self._createOAuthError('Failed to obtain request token', err)); }

    tokenCallback(token)

  })
}

TwitterAuthenticationStrategy.prototype.verifyUser = function(req, done){

  this.obtainUser(req, done)

}

TwitterAuthenticationStrategy.prototype.obtainUser = function(req, done){

  var oauthToken = req.query.oauth_token;
  var oauthVerifier = req.query.oauth_verifier || null;
  var oauthTokenSecret = null;

  this._oauth.getOAuthAccessToken(oauthToken, oauthTokenSecret, oauthVerifier, function(err, token, tokenSecret, params) {
    if (err) {
      return console.log(err);
    }

    this.addUserProfileInfo(token, tokenSecret, params, done)

  }.bind(this))

}

TwitterAuthenticationStrategy.prototype.addUserProfileInfo = function(token, tokenSecret, params, done) {

  console.log(this._o.userProfileURL + '?user_id=' + params.user_id);
  this._oauth.get(this._o.userProfileURL + '?user_id=' + params.user_id, token, tokenSecret, function (err, body, res) {

    params._body = JSON.parse(body);

    done(token, tokenSecret, params);
  })
}





module.exports = TwitterAuthenticationStrategy;
