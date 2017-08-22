//Model for user
var mongoose 	= require("mongoose");
var bcrypt 		= require('bcrypt');

//Set Promise middleware
mongoose.Promise = require('bluebird');

// Bcrypt
const saltRounds 			= 10;
const myPlaintextPassword 	= process.env.APIKEYSEARCHGOOGLE;

// Convenience variable
var Schema = mongoose.Schema;

// Create Schema
// https://stackoverflow.com/questions/5794834/how-to-access-a-preexisting-collection-with-mongoose
var UserSchema = new Schema(
	{
    	username : String,
    	password : String,
    	polls 	 : Array //Array of poll Objects
	},
    { 
    	collection : 'usersvotingx' 
	}
); 

var User = module.exports = mongoose.model('User', UserSchema);


// Method to save user.
module.exports.createUser = function(newUser, callback){

	//Check if exists if not save it.
	User.find({'username': newUser.username}).then(function(user){
		
		//console.log(user);
		
		if(user.length > 0){
			
			callback({
				'status': 'error', 
				'msg'	: 'User exists.'
			});

		} else {

			//No user with that email, Hash it and save it.
			bcrypt.genSalt(saltRounds, function(err, salt) {
			    bcrypt.hash(newUser.password, salt, function(err, hash) {
			        if(err){
			        	
			        	callback({
							'status': 'error', 
							'msg': 'Problem with hashign password'
						});

			        } else {
			        	
			        	newUser.password = hash;
			        	newUser.save().then(function(usersaved){

			        		//Saved, return callback with no error.
			        		callback(null, {
								'status': 'success', 
								'msg'	: 'User Saved on DB'
							});

			        	}, function(err){

			        		//Saved, return callback
			        		callback({
								'status': 'error', 
								'msg'	: err
							});

			        	});
			        }
			    });
			});

		}
	
	}, function(err){
		
		callback({
			'status': 'error', 
			'msg'	: err
		});

	});

}

// Method to check if user exists on DB
module.exports.getUserByUsername = function(username, callback){
	var query = {'username': username};
	User.findOne(query, callback);
}

// Method get user by Id
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

// Method to check if password hashes match
module.exports.comparePassword = function(candidatePassword, hashPassword, callback){

	bcrypt.compare(candidatePassword, hashPassword, function(err, res) {
    	callback(null, res);
	});

}

//Add poll to user
module.exports.pushPoll = function(poll, callback){
	User.polls.push(poll);
	User.save().then(callback);
}