var FacebookAuthenticationStrategy = require('./authentication/facebook.js');

function FacebookStrategy(options){

  this._auth =  new FacebookAuthenticationStrategy(options);

}


FacebookStrategy.prototype.setRequest = function(req){
  this._req = req;
  return this;
}

FacebookStrategy.prototype.setResponse = function(res){
  this._res = res;
  return this;
}

FacebookStrategy.prototype.setUserModel = function(userModel){
  this._userModel = userModel;
  return this;
}


FacebookStrategy.prototype.handle = function(done){

  if(this._req.query.code){

    this._auth.obtainAccessToken(this._req.query.code, function(accessToken, data){

      data.oauth_token = accessToken;
      data.email = data.email;
      data.username = data.name;
      data.firstName = data.first_name;
      data.lastName = data.last_name;

      this._saveAuthData(data, done)

    }.bind(this))
  }
  else {

    this._res.json({'authentication_url':this._auth.createAuthUrl()})

  }

}

FacebookStrategy.prototype._saveAuthData = function(data, done){

  	var user = this._userModel.findOne({
  		'fb.id': data.id,
  	}, function(err, user) {

      if(err) {
        console.log(err);
        return;
      }

      var status = "";

  		if(user === null) {

  			user = 	new this._userModel({
        		fb: data
        	});
        status = "saved";

  		}else{

        user.fb.oauth_token = data.oauth_token;
        status = "updated"
      }

      user.save(function(err) {
        if (err) throw err;
        console.log('FB User ' + status +' successfully');
      });

      done(this._res, user);

  	}.bind(this))

}



module.exports = FacebookStrategy
