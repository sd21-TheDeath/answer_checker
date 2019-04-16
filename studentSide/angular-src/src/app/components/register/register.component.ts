import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import { start } from 'repl';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  public myForm: FormGroup;
  /*starting_year: String;
  course_code: String;
  max_id: String;
  password: String;
  name : String;
  email : String;
  username : String;*/

  constructor(
    private _fb: FormBuilder,
    private validateService: ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router: Router
  ) { }
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  ngOnInit() {
    this.myForm = this._fb.group({
      batch: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      program: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      max_id: ['',[Validators.required, Validators.minLength(9), Validators.maxLength(9)]]
    })
  }
  
  onRegisterSubmit(){
    console.log(this.myForm.value.batch)
    console.log(this.myForm.value.program)
    this.myForm.value.max_id = '201601007';
    console.log(this.myForm.value.max_id)

    var totalMailsToSend = Number((Number(this.myForm.value.max_id) - (Number(this.myForm.value.batch)*100 + Number(this.myForm.value.program))*1000))
    var i;
    var prefixInInteger = Number(Number(this.myForm.value.batch)*100 + Number(this.myForm.value.program))*1000
    for (i = 0; i < totalMailsToSend; i++) {
      const user = {
        name: (prefixInInteger + i).toString(),
        email: (prefixInInteger + i).toString() + '@daiict.ac.in',
        username: (prefixInInteger + i).toString(),
        profession : 'student',
        password: this.generatePassword()
      }
      console.log(user)
      if(!this.validateService.validateRegister(user)){
        console.log('will never be here')
        this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }

      if(!this.validateService.validateEmail(user.email)){
        this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }
      this.authService.registerUser(user).subscribe(data => {
        console.log(data)
        if(data.success){
          this.flashMessage.show('You are now registered and can log in', {cssClass: 'alert-success', timeout: 3000});
          this.router.navigate(['/register']);
        } else {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/register']);
        }
      });

    }
    
/*
    
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register user
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.flashMessage.show('You are now registered and can log in', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      }
    });
*/
  }

  generatePassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
}
