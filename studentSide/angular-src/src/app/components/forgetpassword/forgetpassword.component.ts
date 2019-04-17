import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';


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
        this.flashmessage.show('OTP sent', {
          cssClass : 'alert-success',
          timeout:1500
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
      this.flashmessage.show('incorrect OTP', {
        cssClass : 'alert-danger',
        timeout:1500
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
      this.flashmessage.show('Username and New Password are required', {
        cssClass : 'alert-danger',
        timeout:1500});
    }
    else {
      this.authserive.changePasswordThroughOTP(json).subscribe(data => {
        if(data.success){
          this.flashmessage.show('Password changed successfully', {
            cssClass : 'alert-success',
            timeout:1500
          });
        }
        else{
          this.flashmessage.show(data.msg, {
            cssClass : 'alert-danger',
            timeout:1500
          });
        }
        this.router.navigate(['/login']);
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
