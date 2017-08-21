// Get dependencies and prepare Express
const express 			    = require('express');
const bodyParser 		    = require('body-parser');
const app 				      = express();
var expressValidator  	= require('express-validator');
var session           	= require('express-session');
var passport          	= require('passport');
var LocalStrategy     	= require('passport-local').Strategy;
var cors                = require('cors');
var cookieParser        = require('cookie-parser');
var MemoryStore         = session.MemoryStore;


// ROUTES
var api  = require('./server/routes/api');

// MODELS
var User = require('./server/models/user');

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(__dirname + '/dist'));

///////// SESSION
// Can use any kind of secret word, i jus used my API key for google
// https://github.com/expressjs/session
app.use(session({ 
  secret: process.env.APIKEYSEARCHGOOGLE,
  cookie: { secure: false, maxAge: 60000 }, 
  resave: true,
  store: new MemoryStore(),
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

// Serializing and Deserializing User Instances
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

 
passport.deserializeUser(function(id, done) {
  
  User.getUserById(id, function(err, user) {
    done(err, user);
  });

});

//Helper to check Auth.
function ensureAuthenticated(req, res, next){
  console.log(req.user);
  if(req.isAuthenticated()){
    console.log('user is good')
    return next();
  } else {
    res.redirect('/login');
  }
}

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';

// Run Listener for App.
var listener = app.listen(port, function(){
	console.log("APP Listening at port: ", listener.address().port);
});