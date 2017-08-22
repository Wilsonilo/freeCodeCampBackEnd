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

// Present Poll
routerAPI.get('/polls/info/:iduser/:idpoll', (req, res) => {

  var idUser    = req.params.iduser;
  var idPoll    = req.params.idpoll;

  console.log("New request for Poll:", idUser, idPoll);
  if(idPoll !== undefined && idUser !== undefined){

      console.log("Fetching information from user:"+ idUser);
      var query = {'_id': idUser};

      User.findOne(query).then(function(user){

        console.log(user);

        //Check if we can find user
        if(user === null){

            console.log('Can\'t find user')
            res.end({'status': 'error', 'msg': 'Can\'t find user with this id.'});

        } else {
            
            //Get polls
            var polls = user.polls;

            //Look for specific poll
            var found = 0;
            for(var i = 0; i < polls.length; i++){
              
              if(polls[i].id === idPoll){

                //found Poll
                found += 1;
                
                //Send information
                res.send({'poll': polls[i], idpoll: idPoll, iduser: idUser})
                res.end();
                break;

              }

            }

            if(found === 0){

              //Can't find poll with that id.
              console.log("Can't find that poll id ");
              res.send({'status': 'error', 'msg': 'Can\'t find that poll id'});
              res.end();

            }

        }

      }, function(err){

          console.log('Error fetching polls from user');
          res.send({'error': 'Error fetching polls from user '+err+''});
          res.end();

    });

  } else {
      res.send({'status': 'error', 'msg': 'Can\'t find poll from this user.'});
      res.end();
  }

});

// Get polls from user.
routerAPI.get('/polls/:iduser', (req, res) => {

  var idUser = req.params.iduser;
  if(idUser !== undefined){

      console.log("Fetching information from user:"+ idUser);
      var query = {'_id': idUser};
      User.findOne(query).then(function(user){

          console.log(user.polls.length);
          res.send({'polls': user.polls});
          res.end();

      }, function(err){

          console.log('Error fetching polls from user');
          res.send({'error': 'Error fetching polls from user '+err+''});
          res.end();

    });

  } else {
      res.send({});
      res.end();
  }

});

//Create new Poll
routerAPI.post('/polls/new', (req, res) => {
  if(req.body !== undefined){

      var userID    = req.body.userid;
      var pollInfo  = req.body.poll;

      //Check if exists if not save it.
      User.findOne({'_id': userID}).then(function(user){
        console.log(user);
        //Check if we can find user
        if(user === null){
            res.end({'status': 'error', 'msg': 'Can\'t find user with this id.'});
        } else {
            user.polls.push(pollInfo);
            user.save().then(function(user){
              res.send({'status': 'success', 'msg': 'Poll created', id: req.body.poll.id});
              res.end();
            })
        }
      });

  } else {

    res.send({'status': 'error', 'msg': 'Can\'t fetch body'});
    res.end();

  }

});

//Delete Poll
routerAPI.delete('/polls/delete/:userid/:idpoll', (req, res) => {

  if(req.params !== undefined){

      var userID    = req.params.userid;
      var pollID    = req.params.idpoll;
      console.log(userID, pollID);

      //Ask Mongoose
      User.findOne({'_id': userID}).then(function(user){
        
        console.log(user);

        //Check if we can find user
        if(user === null){
            console.log('Can\'t find user')
            res.end({'status': 'error', 'msg': 'Can\'t find user with this id.'});

        } else {
            
            //https://stackoverflow.com/questions/14763721/mongoose-delete-array-element-in-document-and-save
            var polls = user.polls;

            //Look for that poll
            var counterDeletes = 0;
            for(var i = 0; i < polls.length; i++){
              
              if(polls[i].id === pollID){

                //FoundOne
                counterDeletes += 1;

                // remove it from the array.
                user.polls.splice(i, 1);

                //save
                user.save().then(function(updated){
                  console.log("updated: ", updated);
                });
                break;

              }

            }

            if(counterDeletes === 0){
              //Can't find poll with that id.
              console.log("Can't find that poll id ");
              res.send({'status': 'error', 'msg': 'Can\'t find that poll id'});
              res.end();

            } else {

              res.send({'status': 'success', 'msg': 'Polls updated'});
              res.end();
            }
        }

      });

  } else {

    res.send({'status': 'error', 'msg': 'Can\'t fetch body'});
    res.end();

  }

});

//Vote in poll
routerAPI.post('/polls/vote', (req, res) => {

    if(req.body !== undefined){

      var userID    = req.body.userid;
      var idPoll    = req.body.pollid;
      var vote      = req.body.vote;

      console.log(userID, idPoll, vote);
      //Check if exists if not save it.
      User.findOne({'_id': userID}).then(function(user){
        
        //console.log(user);
        
        //Check if we can find user
        if(user === null){
            res.end({'status': 'error', 'msg': 'Can\'t find user with this id.'});
        } else {

          //Look for poll
          var polls = user.polls;
          var answersFromPoll;
          var userPolls;
          //Look for specific poll
          var foundPoll   = 0;
          var foundAnswer = 0;
          for(var i = 0; i < polls.length; i++){
            
            if(polls[i].id === idPoll){

              //found Poll
              foundPoll += 1;

              //Look for answer
              answersFromPoll = polls[i].content.answers;

              //console.log(answersFromPoll);
              
              //Loop answers and update.
              for(var o=0; o < answersFromPoll.length; o++){

                if(answersFromPoll[o].answer === vote){
                  //Found Answer
                  foundAnswer += 1;

                  //Increase
                  if(answersFromPoll[o]['votes'] === undefined) {
                    answersFromPoll[o].votes  = 1;
                  } else {
                    answersFromPoll[o]['votes'] += 1;
                  }
                  break;
                }

              }

              //Save
              user.polls[i].content.answers = answersFromPoll;
              userPolls = user.polls;
              break;
            }

          }

          if(userPolls !== undefined) {

            user.update({'polls': userPolls}).then(function(user){
              console.log(user);
            });
            res.send({'status': 'success', 'msg': 'Voted.'});
            res.end();

          } else {

            res.send({'status': 'error', 'msg': 'Problem proccesing vote.'});
            res.end();
          }
            
        }//Ends if(user === null){
          
      });

    } else {

      res.send({'status': 'error', 'msg': 'Can\'t fetch body'});
      res.end();

    }
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


    //First check if we have username
    User.getUserByUsername(usernameTwitter, function(err, user){
      
      //Check for error fetching
      if (err) { return done(err); }

      //Create user if does not exist, log in if exists.
      if(!user){

        //Create Registration
        var newUser = new User({
            'username': usernameTwitter,
            'password': null
        });
        newUser.save()
        return done(null, newUser);

      } else {

        //user found
        return done(null, user);

      }

    });

  }
));

///////// AUTH for TWITTER

//Twitter Handlers
routerAPI.get('/auth/twitter', passport.authenticate('twitter'));

routerAPI.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/dashboard',
                                     failureRedirect: '/login' }));


///////// USERS

// Logins user (username / password)
routerAPI.post('/users/login',

  passport.authenticate('local'), 

  (req, res) => {
  res.end(JSON.stringify({'status': 'success', 'msg': 'Login correct', 'user_id': req.user._id, 'username': req.user.username}));

});

// Register user
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

//Check Session of user.
routerAPI.get('/users/session/',function(req, res){
  console.log("running /users/session/ ", req.user);
  if(req.user !== undefined){
    res.send(JSON.stringify(req.user))
    res.end();
  } else {
    res.send({})
    res.end();
  }
});

/* Catch all for the API on get that is not declared */
routerAPI.get('*', (req, res) => {
  res.send('API to fetch information if functional, read documentation.');
  res.end();
});

module.exports = routerAPI;
