import { Component, OnInit  } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { Http } from '@angular/http';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  
  //Properties
  question	: string 	= ''
  userId	: string;
  pollId	: string;
  novotes	: boolean 	= true;
  loadtxt	: string	= 'Loading...';
  valselect : string;
  uservoted : Boolean	= false; //Later gonna work IP check.


  // Doughnut
  public doughnutChartLabels:string[] = [];
  public doughnutChartData:number[] = [];
  public doughnutChartType:string = 'doughnut';

  constructor(private activatedRoute: ActivatedRoute, private http:Http) { }

  ngOnInit() {

  	// subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
        this.userId = params['iduser'];
        this.pollId = params['idpoll'];
        
        if(this.userId !== undefined && this.pollId !== undefined){
        	this.getValuesFromPoll(this.userId, this.pollId);
        }

    });

  }


  //Helpers
  getValuesFromPoll(userId, pollId){

  	//Reset
  	this.doughnutChartLabels = [];
  	this.doughnutChartData = [];
  	this.novotes = true
	this.loadtxt = 'Loading...';

  	this.http.get('http://localhost:3000/api/polls/info/'+userId+'/'+pollId).map(res => res.json()).subscribe(res => {
  		if(res.poll !== undefined){
  			
  			//Set Question
  			this.question = res.poll.content.question;
  			
  			//Set Labels
  			var data = [];
  			for(var i = 0; i < res.poll.content.answers.length; i++){
  				console.log(res.poll.content.answers[i].answer);
  				this.doughnutChartLabels.push(res.poll.content.answers[i].answer);

  				//Get votes from this label
  				var votes = res.poll.content.answers[i].votes;
  				if(votes !== undefined){
  					data.push(parseInt(votes));
  				} else {
  					if(data.length > 0){
  						data.push(0);
  					}
  				}
  				
  				//Check if we are done
  				if(i === res.poll.content.answers.length-1){

		  			//If we have votes.
		  			if(data.length > 0){
		  				this.doughnutChartData = data;
		  				this.novotes = false
		  			} else {
		  				this.loadtxt = 'No votes yet.';
		  			}
		  			//console.log(this.doughnutChartLabels, this.doughnutChartData);

  				}
  				
  			}

  		}
  	});

  }

  selected(valueselected){
  	
  	this.valselect = valueselected;

  }

  Vote(){
  	
  	if(this.valselect !== undefined){
  		
  		//Prepare Headers
      	var headerslogin = new Headers();
      	headerslogin.append('Content-Type', 'application/json');

      	//Prepare params
      	var voteRequest = {
      		userid: this.userId,
      		pollid: this.pollId,
      		vote:	this.valselect
      	}

      	//Send post request
      	this.http.post('http://localhost:3000/api/polls/vote', voteRequest, headerslogin)
        	.map(res => res.json()).subscribe(res => {

              if(res.status === 'success'){
              	this.uservoted = true;
              	this.getValuesFromPoll(this.userId, this.pollId);
              }

          }, err => {
            
            //User or Password incorrect
            console.log(err);
            return;

          });

  	} else{
  		console.log("No vote selected yet");
  	}

  }

}
