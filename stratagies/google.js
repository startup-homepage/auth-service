var GoogleAuthenticationStrategy = require ('./authentication/google.js');

function GoogleStrategy(options){

  this._auth = new GoogleAuthenticationStrategy(options);

}

GoogleStrategy.prototype.setRequest = function(req){
  this._req = req;
  return this;
}

GoogleStrategy.prototype.setResponse = function(res){
  this._res = res;
  return this;
}

GoogleStrategy.prototype.setUserModel = function(userModel){
  this._userModel = userModel;
  return this;
}


GoogleStrategy.prototype.handle = function(done){

  if(this._req.query.code){

    this._auth.obtainAccessToken(this._req.query.code, function(accessToken, data){

        data.oauth_token = accessToken;
        data.email = data.emails[0].value;
        data.username = data.displayName;
        data.firstName = data.name.givenName;
        data.lastName = data.name.familyName;

        this._saveAuthData(data, done)

    }.bind(this))

  }else{

    this._res.json({authentication_url:this._auth.createAuthUrl()});

  }

}

GoogleStrategy.prototype._saveAuthData = function(data, done){


  	var user = this._userModel.findOne({
  		'google.id': data.id,
  	}, function(err, user) {

      if(err) {
        console.log(err);
        return;
      }

      var status = "";

  		if(user === null) {

  			user = 	new this._userModel({
        		google: data
        	});
        status = "saved";

  		}else{

        user.google.oauth_token = data.oauth_token;
        status = "updated"
      }

      user.save(function(err) {
        if (err) throw err;
        console.log('Google User ' + status +' successfully');
      });

      done(this._res, user);

  	}.bind(this))

}



module.exports = GoogleStrategy
