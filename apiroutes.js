var routes = require('express').Router();
var superSecret = require('./config.js').secret;
var tokenTTL = require('./config.js').tokenTTL;
var jwt = require('jsonwebtoken');
var UserModel = require('./models/User.js');

routes.get('/setup', function(req, res) {

	// create a sample user
	var nick = new UserModel({
		username: 'test',
		password_hash: 'test',
		admin: true
	});

	nick.save(function(err) {
		  if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});




routes.post('/signup', function(req, res, next){

    if(typeof req.body.username == "undefined"){
      return failed(res, 'Authentication needs a username and password_hash')
    }

		console.log(req.body)

		if(typeof req.body.username 		 == "undefined" ||
			 typeof req.body.password_hash == "undefined" ){
			return failed(res, 'Authentication needs a username and password_hash')
		}

		var newUser = new UserModel({
      username: req.body.username,
			password_hash : req.body.password_hash
    });

    newUser.save(function(err) {

      if(err)
        throw err;

			return createJWTResponse(res, newUser);

    })

});


routes.post('/authenticate', function(req, res){

	if(typeof req.body.username == "undefined"){
		return failed(res, 'Authentication needs a username and password_hash')
	}

	console.log(req.body)

	UserModel.findOne({
		username: req.body.username,
	}, function(err, user) {

		if(err)
			throw err;

		console.log(user);

		if(!user){
			return failed(res, 'Authentication failed. User not found.')
		}

		if(user.password_hash !== req.body.password_hash){
			return failed(res, 'Authentication failed. Wrong password.')
		}

		return createJWTResponse(res, user);

	})

});

function createJWTResponse(res, user){

	var token = jwt.sign(user, superSecret, { expiresInMinutes: tokenTTL })

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token
	})

}

routes.use(function(req, res, next){

    var token = req.body.token || req.params['token'] || req.headers['x-access-token'];
    if(!token) {
      return failed(res, 'No token provided');
    }

    jwt.verify(token, superSecret, function(err, decoded){

      if (err) {
        return failed(res, 'The token is not valid');
      }

      req.decoded = decoded;
      next();

    })

})




var failed = function(res, msg){
  return res.status(403).send({
    success: false,
    message: msg
  })
}


module.exports = routes;
