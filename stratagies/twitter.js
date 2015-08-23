var TwitterAuthenticationStrategy = require ('./authentication/twitter.js');


function TwitterStrategy(twitterConfig) {
  this._auth = new TwitterAuthenticationStrategy(twitterConfig);
}

TwitterStrategy.prototype.setRequest = function(req){
  this._req = req;
  return this;
}

TwitterStrategy.prototype.setResponse = function(res){
  this._res = res;
  return this;
}

TwitterStrategy.prototype.setUserModel = function(userModel){
  this._userModel = userModel;
  return this;
}

TwitterStrategy.prototype.handle = function(done){

  if(this._req.query.oauth_token){
    this._auth.verifyUser(this._req, function(token, tokenSecret, params){

       params.id = params.user_id;
       params.oauth_token = token;
       params.oauth_token_secret = tokenSecret;
       params.username = params._body.screen_name
       this._saveAuthData(params, done)

    }.bind(this));
  }
  else{
    this._auth.sendValidUserAuthorizationURL(this._res);
  }

}

TwitterStrategy.prototype._saveAuthData = function(data, done){


  	var user = this._userModel.findOne({
  		'twitter.id': data.id,
  	}, function(err, user) {

      if(err) {
        console.log(err);
        return;
      }

  		if(user === null) {
  			user = this._createUser(data)
  		}

      done(this._res, user);

  	}.bind(this))

}


TwitterStrategy.prototype._createUser = function(data){

	var newUser = new this._userModel({
		twitter: data
	});

	newUser.save(function(err) {

		if (err) throw err;
		console.log('Twitter User saved successfully');
	});

  return newUser;
}




module.exports = TwitterStrategy;
