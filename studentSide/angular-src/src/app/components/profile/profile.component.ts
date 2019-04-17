import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user : Object;
  userPresent = false;
  constructor(
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit() {
    let myString = localStorage.getItem('user');
    console.log(myString);
    if(myString){
      let myObjUser = JSON.parse(localStorage.getItem('user'));
      console.log(myObjUser);
      this.authService.getProfile(myObjUser.username).subscribe(profile => {
        this.user = profile.user;
        console.log(profile.user);
        this.userPresent = true;
      },
      err => {
        console.log(err);
        this.userPresent = false;
        return false;
      });
      if(myObjUser.profession == "student"){
        this.authService.getStudentProfile(myObjUser.username).subscribe(profile => {
          //do what wanted with profile
          console.log(profile);
          // this.userPresent = true;
        },
        err => {
          console.log(err);
          // this.userPresent = false;
          return false;
        });
      }
      // else{
        // this.authService.getProfile(myObjUser.username).subscribe(profile => {
        //   this.user = profile.user;
        //   console.log(profile.user);
        //   this.userPresent = true;
        // },
        // err => {
        //   console.log(err);
        //   this.userPresent = false;
        //   return false;
        // });
      // }
    }
  }

}
