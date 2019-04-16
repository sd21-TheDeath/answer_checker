import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {FlashMessagesService} from 'angular2-flash-messages';
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
    // private navbar : NavbarComponent,
    private flashmessage : FlashMessagesService) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]]
    });
    this.authservice.castStudent.subscribe(userLoggedIn => this.dummyUserLoggedIn = userLoggedIn)
  }

  onLoginSubmit(){
    const user = this.myForm.value;

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
          this.flashmessage.show('student logged in', {
            cssClass : 'alert-success',
            timeout:1500});
        }
        else if(data.user.profession == "professor"){
          this.authservice.professorIsNowLoggedIn();
          this.flashmessage.show('professor logged in', {
            cssClass : 'alert-success',
            timeout:1500});
        }
        else if(data.user.profession == "admin"){
          this.authservice.adminIsNowLoggedIn();
          this.flashmessage.show('admin logged in', {
            cssClass : 'alert-success',
            timeout:1500});
        }
        this.router.navigate(['dashboard']);
      }else{
        this.flashmessage.show(data.msg, {
          cssClass : 'alert-danger',
          timeout:1500});
        this.router.navigate(['login']);
      }
    } )
  }

  forgetPassword(){
    console.log("password forgotten")
  }

  changePassword(){
    console.log("password change requested")
    if(this.myForm.value.username == undefined){
      console.log("Enter username")
      this.flashmessage.show('Please enter username', {
        cssClass : 'alert-danger',
        timeout:1500});
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
