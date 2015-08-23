var request = require('request');

function GoogleAuthenticationStrategy(options) {

  options.authURL = options.authURL || "https://accounts.google.com/o/oauth2/auth";
  options.accessTokenURL = options.accessTokenURL || "https://www.googleapis.com/oauth2/v3/token";
  options.userProfileURL = options.userProfileURL || "https://www.googleapis.com/plus/v1/people/me";


  this._o = options;

}

GoogleAuthenticationStrategy.prototype.createAuthUrl = function(res){

  var redirect_uri = this._o.callbackURL;
  var client_id = this._o.clientID;

  var request_url = this._o.authURL
  + "?scope=email"
  + "&state=token"
  + "&redirect_uri=" + redirect_uri
  + "&response_type=code&client_id=" + client_id
  + "&approval_prompt=force";

  return request_url;

}

GoogleAuthenticationStrategy.prototype.obtainAccessToken = function(code, done) {


  var payload = {
    grant_type: 'authorization_code',
    code: code,
    client_id: this._o.clientID,
    client_secret: this._o.clientSecret,
    redirect_uri: this._o.callbackURL
  };

  request.post(this._o.accessTokenURL, { form: payload }, function(e, response, body) {

    if(e){
      console.error(e)
      return;
    }


    var data = JSON.parse(body);
    this.addUserProfileInfo(data.token_type, data.access_token, done)

  }.bind(this));

}

GoogleAuthenticationStrategy.prototype.addUserProfileInfo = function(tokenType, accessToken, done) {


  console.log( tokenType + ' ' +  accessToken);

  request(this._o.userProfileURL, { headers: {'Authorization': tokenType + ' ' +  accessToken } }, function(e, r, body) {

    if(e) {
      console.log(e)
      return;
    }

    done(accessToken, JSON.parse(body));

  }.bind(this));

}




module.exports = GoogleAuthenticationStrategy;
