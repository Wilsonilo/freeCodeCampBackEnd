import { Component, OnInit } from '@angular/core';
import { Router, ROUTES } from '@angular/router';
import { DataService } from '../services/data.service'
import { User } from '../interfaces/user'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  User:User;

  constructor(public dataService:DataService, public router:Router) { 
  	
  	//Set user if is holded on the singleton
  	this.User = dataService.getUser();

  	//Check if is logged
  	if(this.User === undefined){
  		this.router.navigateByUrl('login');
  	}

  }

  ngOnInit() {}

}
