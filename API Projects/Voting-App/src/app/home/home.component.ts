import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  people:any[];
  
  constructor() { 

  	  	 // http.get('https://jsonplaceholder.typicode.com/users') 
    //   .map(res => res.json())
    //   .subscribe(people => {
      	
    //   	this.people = people;
    //   	console.log(this.people);

    //   });
  		

  }

  ngOnInit() {
  }

}
