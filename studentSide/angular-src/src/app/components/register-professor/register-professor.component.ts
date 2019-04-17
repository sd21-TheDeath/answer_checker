import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-register-professor',
  templateUrl: './register-professor.component.html',
  styleUrls: ['./register-professor.component.css']
})
export class RegisterProfessorComponent implements OnInit {
  public myForm: FormGroup; 
  //name : String;
  //email : String;
  //username : String;
  password : String;
  
  constructor(
    private validateService: ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router: Router,
    private _fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.myForm = this._fb.group({
      name: ['',[Validators.required]],
      email: ['',[Validators.required]],
      username: ['',[Validators.required]]
    })
  }

  
  onRegisterSubmit(){   
    this.password = this.generatePassword();
    const user = {
      name: this.myForm.value.name,
      email: this.myForm.value.email,
      username: this.myForm.value.username,
      profession : 'professor',
      password: this.password
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)){
      this.snackBar.open('Please fill in all fields', 'Error', {
        duration: 3000,
      });
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.snackBar.open('Please use a valid email', 'Error', {
        duration: 3000,
      });
      return false;
    }

    // Register user
    this.authService.registerUser(user).subscribe(data => {
      console.log(user);
      if(data.success){
        this.snackBar.open('You are now registered and can log in', 'Success', {
          duration: 3000,
        });
        this.router.navigate(['/registerprofessor']);
      } else {
        this.snackBar.open('Something went wrong', 'Error', {
          duration: 3000,
        });
        this.router.navigate(['/registerprofessor']);
      }
    });
  }

  generatePassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
}
