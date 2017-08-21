//Model for poll

var mongoose 	= require("mongoose");

module.exports 	= mongoose.model('Poll',{
    question 	: String,
    questions   : []
});