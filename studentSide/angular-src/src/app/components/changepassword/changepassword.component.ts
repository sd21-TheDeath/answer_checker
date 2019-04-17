import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {FlashMessagesService} from 'angular2-flash-messages';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  public myForm: FormGroup;
  username : String;
  //password : String;
  //newPassword : String;
  user : Object;
  userPresent = false;
  constructor(
    private _fb: FormBuilder,
    private authservice:AuthService,
    private snackBar: MatSnackBar,
    private router : Router,
    private flashmessage : FlashMessagesService) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      password: ['',[Validators.required]],
      newPassword: ['',[Validators.required]]
    })

    let myString = localStorage.getItem('user');
    //console.log(myString);
    if(myString){
    let myObjUser = JSON.parse(localStorage.getItem('user'));
    this.authservice.getProfile(myObjUser.username).subscribe(profile => {
      this.user = profile.user;
      this.username = profile.user.username;
      // console.log(this.username);
      this.userPresent = true;
    },
    err => {
      //console.log(err);
      this.userPresent = false;
      return false;
    });
    }
  }

  changePassword(){
    
    const user = {
      username : this.username,
      password : this.myForm.value.password
    }
    //console.log(user.username);
    this.authservice.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authservice.storeUserData(data.token, data.user);
        if(data.user.username == user.username){
          const jsonToSend = {
            username : this.username,
            password : this.myForm.value.password,
            newPassword : this.myForm.value.newPassword
          }

          this.authservice.changePassword(jsonToSend).subscribe(data => {
            if(data.success){
              localStorage.clear();
              this.authservice.userIsNowLoggedOut();
              this.authservice.logout();
              this.snackBar.open('password changed successfully. Please, login again using new password', 'Success', {
                duration: 3000,
              });
              // this.flashmessage.show('password changed successfully. Please, login again using new password', {
              //   cssClass : 'alert-success',
              //   timeout:1500
              // })
              this.router.navigate(['/login']);
            }
          });
        }
        else {
          this.snackBar.open('something went wrong', 'Error', {
            duration: 3000,
          });
        }
      }else{
        this.snackBar.open(data.msg, 'Error', {
          duration: 3000,
        });
        this.router.navigate(['changepass']);
      }
    } )
  }
}
