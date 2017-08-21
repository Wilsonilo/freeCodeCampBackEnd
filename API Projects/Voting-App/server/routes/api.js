const express         = require('express');
const routerAPI       = express.Router();
var passport          = require('passport');
var LocalStrategy     = require('passport-local').Strategy;
var TwitterStrategy   = require('passport-twitter').Strategy;
var mongoose          = require('mongoose');
var session           = require('express-session');
var cors              = require('cors')

//Set Cors and Flash dependencias
//Cors to allow cross origin and flash for the error messages.
routerAPI.use(cors())
routerAPI.use(require('flash')());

/////// MODELS
var User = require('../models/user');

/////// CONNECTION

// GET DB Config
var db   = require('../configs/db');

//Connect Mongoose
mongoose.connect(db.mLabURI, {
    //http://mongoosejs.com/docs/connections.html#use-mongo-client
    useMongoClient: true 
});

// Database state
var dbConnection = mongoose.connection;

// DB connection success
dbConnection.on('connected', function()
{
   console.log('Mongoose successfully connected to MongoDB');
});

// DB connection error
dbConnection.on('error', function(error)
{
    console.log('Mongoose connection error: ' + error);
});


///////// API

// Get top 10 polls
routerAPI.get('/polls/top', (req, res) => {
  res.send('Will return a JSON with the latests 10 polls for home');
});

// Get top 10 polls
routerAPI.get('/polls/:user', (req, res) => {
  res.send('Will return a JSON with the polls of the :user');
});

//Create new Poll
routerAPI.post('/polls/new', (req, res) => {
  res.send('Will create a poll');
});

//Create new Poll
routerAPI.delete('/polls/delete/:id', (req, res) => {
  res.send('Deletes a poll with an ID');
});



///////// PASSPORT
passport.use(new LocalStrategy(

  function(username, password, done) {
    //First check if we have username
    User.getUserByUsername(username, function(err, user){

      //Error
      if(err){
        console.log("ERROR ", err);
        return done(null, false);

      };
      
      //Error does not exist.
      if(!user){
        console.log("user not found");
        return done(null, false);
      }

      //User exists, check for password
      User.comparePassword(password, user.password, function(err, isMatch){
        
        //Error
        if(err){
          console.log("Error on password: ", err)
          return done(err);
        };

        //Check if password is matched
        if(!isMatch){

          console.log('Password do not match.');

          return done(null, false);

        } else {
          
          console.log('Username and password correct');
          return done(null, user);
        }

      });//Ends User.comparePassword

    });//Ends User.getUserByUsername

  }

));


passport.use(new TwitterStrategy({
    consumerKey: process.env.FREECODECAMPTWITTERKEY,
    consumerSecret: process.env.FREECODECAMPTWITTERSECRET,
    callbackURL: "http://localhost:3000/api/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {

    var usernameTwitter = profile.username;
    
    console.log(username);

    //First check if we have username
    User.getUserByUsername(username, function(err, user){
      
      //Check for error fetching
      if (err) { return done(err); }

      //Create user if does not exist, log in if exists.
      if(!user){

        //Create Registration
        var newUser = new User({
            'username': usernameTwitter,
            'password': null
        });
        return done(null, newUser);

      } else {

        //user found
        return done(null, user);

      }

    });

  }
));

///////// USERS

// Logins user
routerAPI.post('/users/login',

  passport.authenticate('local'), 

  (req, res) => {
  res.end(JSON.stringify({'status': 'success', 'msg': 'Login correct', 'user_id': req.user._id, 'username': req.user.username}));

});

//Twitter
routerAPI.get('/auth/twitter', passport.authenticate('twitter'));

routerAPI.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/dashboard',
                                     failureRedirect: '/login' }));

// Registers user
routerAPI.post('/users/register', (req, res) => {

  // Set vars
  var username        = req.body.username;
  var password        = req.body.password;
  var passwordrepeat  = req.body.password; // Fix later

  // Check if we have username and password from here.
  // Injection on front is possible.
  if(username === undefined || password === undefined){
    console.log("Undefined username or password");
    res.send(JSON.stringify({'status': 'error', 'msg': 'Empty username or password'}));
    res.end();
  }

  if(password !== passwordrepeat){
    console.log("Passwords do not match");
    res.send(JSON.stringify({'status': 'error', 'msg': 'Password do not match'}));
    res.end();
  }

  //Create Registration
  var newUser = new User({
    'username': username,
    'password': password
  });

  //Run createUser method with the newUser Object
  User.createUser(newUser, function(err, response){

      console.log(err, response)
      if(err){
        
        console.log("Error creating user", err);
        res.send(JSON.stringify({'status': 'error', 'msg': err.msg}));
        res.end();

      } else {
        
        console.log("User created:", response);
        res.send(JSON.stringify({'status': 'success', 'msg': 'User Created'}));
        res.end();

      }

  });

});

// Logout User
routerAPI.get('/users/logout', function(req, res) {
  
  console.log('loging out user.');
  req.logout();
  res.redirect('/home');

});

/* Catch all for the API on get that is not declared */
routerAPI.get('*', (req, res) => {
  res.send('API to fetch information if functional, read documentation.');
  res.end();
});


module.exports = routerAPI;
