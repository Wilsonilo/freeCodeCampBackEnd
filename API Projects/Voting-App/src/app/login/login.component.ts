import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/map'
import {Http} from '@angular/http';
import { Router, ROUTES } from '@angular/router';
import { User } from '../interfaces/user'
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  //Objects for Login and Register Users
  userLogin:object = {
    'username'        : '',
    'password'        : ''
  }
  userRegister:object = {
    'username'        : '',
    'password'        : '',
    'passwordRepeat'  : ''
  }

  //Other Holders for errors and stuff
  upError     :boolean   = false;
  upSuccess   :boolean   = false;
  msgError    :string    = '';
  msgSuccess  :string    = '';

  //Constructor
  constructor(public http: Http, public router: Router, public dataService: DataService) {}
  
  //Ng Init
  ngOnInit(){}

  //MARK: - Handlers
  //Login
  onSubmitLogin({value, valid}){

    if(valid){
      	
        //Prepare Headers
      	var headerslogin = new Headers();
      	headerslogin.append('Content-Type', 'application/json');
      	
      	//Set information:
      	var username = this.userLogin['username'];
      	var password = this.userLogin['password'];
      	
        //Last check for empty
      	if( username !== undefined && password !== undefined) {
      		
          //Send and get response
        	this.http.post('http://localhost:3000/api/users/login', this.userLogin, headerslogin)
        	.map(res => res.json()).subscribe(res => {

              console.log(res);
              
              //Set User
              this.dataService.setUser(res.user_id, res.username);

              //Success
              this.upSuccess      = true;
              this.msgSuccess     = 'User loged in redirecting to Dashboard...';

              //Redirect with timeout to dashboard
              setTimeout(() => {
                this.router.navigateByUrl('dashboard');
              }, 2000);

          }, err => {
            
            //User or Password incorrect
            this.upError   = true;
            this.msgError  = 'Username or Password incorrect.';
            console.log("Username or Password incorrect.");
            return;

          });

        } else{

           this.upError   = true;
           this.msgError  = 'Username or Password empty.';
           console.log("Username or Password not defined");
           return;

        }

    } else {
      this.upError   = true;
      this.msgError  = 'Username or Password not set.';
      console.log("Username or Password not defined");
      return;
    }

  }//Ends onSubmitLogin


  //Register
  onSubmitRegister({value, valid}){
    if(valid){

        //Prepare Headers
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        
        //Set information:
        var username       = this.userRegister['username'];
        var password       = this.userRegister['password'];
        var passwordRepeat = this.userRegister['passwordRepeat'];

        //Check Password
        if(password !== passwordRepeat){

          console.log("Password are not the same");
          this.upError   = true
          this.msgError  = 'Password on registration form are not the same.';
          return;

        }

        //Last check for empty
        if( username !== undefined && password !== undefined && passwordRepeat !== undefined) {
          
          //Send and get response
          this.http.post('http://localhost:3000/api/users/register', this.userRegister, headers)
          .map(res => res.json()).subscribe(res => {

            console.log(res);
            if(res.status === "error"){

               this.upError   = true
               this.msgError  = res.msg;

            } else {

              //Success
              this.upSuccess  = true;
              this.msgSuccess = res.msg + ' Redirecting to Dashboard...';

              //Redirect with timeout to dashboard
              setTimeout(() => {
                this.router.navigateByUrl('dashboard');
              }, 2000);

            }

          });

        } else{
          console.log("Username and Password not defined");
          this.upError   = true
          this.msgError  = 'Empty fields or passwords are not the same.';
          return;
        }


    }else{
      
      console.log("Form not valid.");
      this.upError   = true
      this.msgError  = 'Empty fields or passwords are not the same.';
      return;
    }

  }//Ends onRegister()

}//Ends Class
