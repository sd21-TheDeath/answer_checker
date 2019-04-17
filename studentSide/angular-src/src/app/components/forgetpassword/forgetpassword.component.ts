import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  public myForm: FormGroup;
  otpGenerated = false;
  otpMatched = false;
  //otpEntered : String;
  //username : String;
  otpGen : String;
  //newPassword : String;
  constructor(
    private _fb: FormBuilder,
    private authserive : AuthService,
    private router : Router,
    private snackBar: MatSnackBar,
    private flashmessage : FlashMessagesService
  ) { }

  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  noEnter(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if(charCode == 13) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      username: ['',[Validators.required]],
      otpEntered: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      newPassword: ['',[Validators.required]]
    })
  }

  generateOTPclick(){
    this.otpGen = this.generateOTP();
    let json = {
      username : this.myForm.value.username,
      otp : this.otpGen};
    this.authserive.generateOTP(json).subscribe(data => {
      if(data.success){
        this.snackBar.open('OTP sent', 'Success', {
          duration: 3000,
        });
        this.otpGenerated = true;
      }
    });
  }

  matchOTPclick(){
    this.otpGen = "0000";

    if(this.myForm.value.otpEntered == this.otpGen){
      this.otpMatched = true;
    }
    else{
      this.snackBar.open('Incorrect OTP', 'Error', {
        duration: 3000,
      });
    }
    
  }

  changePassword(){
    //console.log(this.myForm.value.newPassword)
    let json = {
      username : this.myForm.value.username,
      newPassword : this.myForm.value.newPassword
    }
    if(json.username==undefined || json.newPassword==undefined) {
      this.snackBar.open('Username and New Password are required', 'Error', {
        duration: 3000,
      });
    }
    else {
      this.authserive.changePasswordThroughOTP(json).subscribe(data => {
        if(data.success){
          this.snackBar.open('Password changed successfully', 'Success', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        }
        else{
          this.snackBar.open(data.msg, 'Error', {
            duration: 3000,
          });
          this.router.navigate(['/forgetpass']);
        }
      });
    }
  }

  generateOTP() {
    var text = "";
    var possible = "0123456789";
  
    for (var i = 0; i < 4; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
}
