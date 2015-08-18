var app = require('express')();
var cors = require('cors');
var config = require('./config.js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var port = process.env.PORT || 3001;

mongoose.connect(config.database); // connect to database

app.use(morgan('dev'));
app.use(cors());
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api', require('./apiroutes.js'));
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
