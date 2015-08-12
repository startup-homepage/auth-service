var routes = require('express').Router();
var superSecret = require('./config.js').secret;
var tokenTTL = require('./config.js').tokenTTL;
var jwt = require('jsonwebtoken');
var UserModel = require('./models/User.js');

routes.get('/setup', function(req, res) {

	// create a sample user
	var nick = new UserModel({
		name: 'Nick Cerminara',
		password: 'password',
		admin: true
	});
	nick.save(function(err) {
		  if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});


routes.post('/authenticate', function(req, res){

    if(typeof req.body.name == "undefined"){
      return failed(res, 'Authentication needs a name and password')
    }

    UserModel.findOne({
      name: req.body.name
    }, function(err, user) {

      if(err)
        throw err;

      console.log(user);

      if(!user){
        return failed(res, 'Authentication failed. User not found.')
      }

      if(user.password !== req.body.password){
        return failed(res, 'Authentication failed. Wrong password.')
      }

      var token = jwt.sign(user, superSecret, { expiresInMinutes: tokenTTL })

      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      })

    })

});


routes.use(function(req, res, next){

    var token = req.body.token || req.params('token') || req.headers['x-access-token'];
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
