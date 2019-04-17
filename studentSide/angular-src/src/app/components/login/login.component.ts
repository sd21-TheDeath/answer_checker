import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {FlashMessagesService} from 'angular2-flash-messages';
import {MatSnackBar} from '@angular/material';

// import {NavbarComponent} from '../navbar/navbar.component';
// console.log('1');
// console.log(NavbarComponent);
// console.log('2');
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public myForm: FormGroup;
  //username : String;
  //password : String;
  dummyUserLoggedIn : boolean;
  constructor(
    private _fb: FormBuilder,
    private authservice:AuthService,
    private router : Router,
    private snackBar: MatSnackBar,
    // private navbar : NavbarComponent,
    private flashmessage : FlashMessagesService) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
    this.authservice.castStudent.subscribe(userLoggedIn => this.dummyUserLoggedIn = userLoggedIn)
  }

  // openSnackBar(message: string, action: string) {
  //   this.snackBar.open(message, action, {
  //     duration: 3000,
  //   });
  // }

  onLoginSubmit(){
    const user = this.myForm.value;
    //console.log(user.username==undefined);
    if(user.username==undefined || user.password==undefined || user.username.length==0 || user.password.length==0) {
      this.snackBar.open('Username and Password are required', 'Error', {
        duration: 3000,
      });
      //this.openSnackBar('Username and Password are required','error');
      // this.flashmessage.show('Username and Password are required', {
      //   cssClass : 'alert-danger',
      //   timeout:1500});
    }
    else {
      this.authservice.authenticateUser(user).subscribe(data => {
        // console.log(data)
        if(data.success){
          // this.navBar.userIsNowLoggedIn();
          this.authservice.storeUserData(data.token, data.user);
          // this.flashmessage.show('You are now logged in', {
          //   cssClass : 'alert-success',
          //   timeout:1500});
          if(data.user.profession == "student"){
            this.authservice.studentIsNowLoggedIn();
            this.snackBar.open('Student logged in', 'Success', {
              duration: 2000,
            });
            // this.flashmessage.show('student logged in', {
            //   cssClass : 'alert-success',
            //   timeout:1500});
          }
          else if(data.user.profession == "professor"){
            this.authservice.professorIsNowLoggedIn();
            this.snackBar.open('Professor logged in', 'Success', {
              duration: 2000,
            });
          }
          else if(data.user.profession == "admin"){
            this.authservice.adminIsNowLoggedIn();
            this.snackBar.open('Admin logged in', 'Success', {
              duration: 2000,
            });
          }
          this.router.navigate(['']);
        }else{
          this.snackBar.open(data.msg, 'Error', {
            duration: 3000,
          });
          this.router.navigate(['login']);
        }
      } )
    }
  }

  forgetPassword(){
    console.log("password forgotten")
  }

  changePassword(){
    //console.log("password change requested")
    if(this.myForm.value.username == undefined){
      //console.log("Enter username")
      this.snackBar.open('Please enter username', 'Error', {
        duration: 3000,
      });
      // this.flashmessage.show('Please enter username', {
      //   cssClass : 'alert-danger',
      //   timeout:1500});
    }
    else{
      const json = {
        username : this.myForm.value.username,
        // password : this.password
      }
      this.authservice.changePassword(json).subscribe(data => {

      });
    }
  }
}
