import { Injectable } from '@angular/core'
import { User } from '../interfaces/user'
import {Http} from '@angular/http';
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppComponent } from '../app.component';

@Injectable()

export class DataService{

	User:User;
	UserObservable:Observable<User>;
	private _user = new BehaviorSubject<User>(undefined);
	userState = this._user.asObservable();
	
	constructor(http: Http){

	}

	// GETTERS
	//Get user
	getUser(){
		return this.User;
	}

	// SETTERS
	//Set Username for DataService
	setUser(id, username){
		this.User = {
			id 	     : id,
			username : username
		}
		this._user.next(this.User);
	}

}
