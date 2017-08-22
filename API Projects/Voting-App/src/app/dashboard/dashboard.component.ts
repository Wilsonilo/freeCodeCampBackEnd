import { Component, OnInit } from '@angular/core';
import { Router, ROUTES } from '@angular/router';
import { DataService } from '../services/data.service'
import { User } from '../interfaces/user'
import { Poll } from '../interfaces/poll'
import { Http } from '@angular/http';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  /// Properties
  User			:User;
  Polls			:Array<Poll>;
  FormPoll		:Poll;
  emptypolls	:boolean 		= true;
  newPoll		:boolean 		= false;
  formNewPoll	:FormGroup; // form group instance
  errorUp		:boolean 		= false
  errorMsg		:string 		= ''

  /// Constructor
  constructor(public dataService:DataService, 
  	public router:Router, public http: Http,
  	private formBuilder: FormBuilder) { 
  }

  /// NG init
  ngOnInit() {
  	
  	//First check for a callback from twitter.
	this.checkForCallback();

	//Prepare Form group
	//https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
	//https://stackoverflow.com/questions/41256852/how-to-add-more-input-fields-using-a-button-angular-2-dynamic-forms
    this.formNewPoll = this.formBuilder.group({
        question: ['', Validators.required],
        answers	: this.formBuilder.array([
            this.initLink(),
        ])
    });

  }


  /// Helpers
  /// Helps to check if user is loged in from a callback(Twitter) 
  /// or username/password
  checkForCallback(){
  	console.log("calling check for callback")
  	this.http.get('http://localhost:3000/api/users/session').map(res => res.json()).subscribe(res => {

  		if (res !== undefined){

  			if(res._id !== undefined && res.username !== undefined){

  				//User is up, set if is not set yet.
  				var currentUser = this.dataService.getUser();
  				if (currentUser === undefined){
  					this.dataService.setUser(res._id, res.username);
  				}
  			}
  		}

  		//Get user if is holded on the singleton
	  	// this.User = this.dataService.getUser();

	  	//Check if is logged
	  	// if(this.User === undefined){
	  	// 	this.router.navigateByUrl('login');
	  	// }

	  	// Get polls from this user
	  	//Temp
	  	this.User = {
	  		id : '599a46ebf16d609759808ed7',
	  		username: 'TEMP',
	  	}
	  	this.dataService.setUser('599a46ebf16d609759808ed7', 'TempUser')

	  	if (this.User !== undefined){

	  		//Set binding for new polls
	  		this.FormPoll = {
	  			question: '',
	  			answers: []
	  		}

	  		this.refreshUserPolls();

	  	}

  	});

  }
  //Helpers for add answers
  	initLink() {
	    return this.formBuilder.group({
	        answer: ['', Validators.required]
	    });
	}
	addAnswer() {
	    const control = < FormArray > this.formNewPoll.controls['answers'];
	    control.push(this.initLink());
	}
	removeAnswer(i: number) {
		if(i !== 0){
	    	const control = < FormArray > this.formNewPoll.controls['answers'];
	    	control.removeAt(i);
		}
	}

  //create poll handler
  createPoll({valid, value}){

  	//Post if valid
  	if(valid){

  		//Prepare Headers
      	var headersPoll = new Headers();
      	headersPoll.append('Content-Type', 'application/json');

      	var pollCreation = {
      		'userid': this.User.id,
      		'poll': {
      			'id': this.guid(),
      			'content': value
      		}
      	};

  		//Send and get response
    	this.http.post('http://localhost:3000/api/polls/new', pollCreation, headersPoll)
    	.map(res => res.json()).subscribe(res => {

          if(res.status === 'success'){
          	//Reset
          	this.newPoll = false;
          	this.formNewPoll = this.formBuilder.group({
		        question: ['', Validators.required],
		        answers	: this.formBuilder.array([
		            this.initLink(),
		        ])
		    });

          	//Refresh
          	this.refreshUserPolls();
          } else {
          	this.errorUp  = true;
          	this.errorMsg = res.msg; 
          }

      	});

  	}

  }

  //Delete Poll
  deletePoll(pollId){
  	
  	//Prepare Headers
    var headersPoll = new Headers();
    headersPoll.append('Content-Type', 'application/json');

	//Send and get response
	this.http.delete('http://localhost:3000/api/polls/delete/'+this.User.id+'/'+pollId)
	.map(res => res.json()).subscribe(res => {

		if(res.status === 'success'){
			//Refresh
        	this.refreshUserPolls();
		}

	});

  }

  //Refresh user Polls
  refreshUserPolls(){

  	//Ask Api for polls of user
	this.http.get('http://localhost:3000/api/polls/'+this.User.id).map(res=>res.json()).subscribe(res =>{
		if(res.polls !== undefined){
			this.Polls = res.polls;

			if(this.Polls.length > 0){
				this.emptypolls = false;
				//console.log(this.Polls);
			} else {
				this.emptypolls = true;
			}
		}
	});

  }

  //Returns username or null
  getUserName(){
  	if(this.User !== undefined){
  		return this.User.username;
  	} else {
  		return '';
  	}
  }

  //Handles creating of new Poll
  showFormForNewPoll(){
  	this.newPoll = !this.newPoll;
  }

  //Generates guiid
 //https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
 }

}