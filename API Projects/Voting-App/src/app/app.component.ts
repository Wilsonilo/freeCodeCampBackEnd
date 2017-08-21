import { Component } from '@angular/core';
import { DataService } from './services/data.service'
import { User } from './interfaces/user'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  User:User;
  isLogged:boolean = false;
  subscription:Subscription;

  constructor(public dataService:DataService) { 

  	// Subscribe to change on User
  	this.subscription = this.dataService.userState.subscribe(user =>{
  		
  		// Set
  		if(user !== undefined){
  			this.isLogged = true;
  			this.User = {
  				id: user.id,
  				username: user.username
  			}
  		}

  	});
  	
  }

}
