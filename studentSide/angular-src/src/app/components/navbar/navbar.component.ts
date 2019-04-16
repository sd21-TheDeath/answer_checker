import { Component, OnInit, Injectable } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

@Injectable()
export class NavbarComponent implements OnInit {

  dummyStudentLoggedIn : boolean;
  dummyProfessorLoggedIn : boolean;
  dummyAdminLoggedIn : boolean;
  constructor(
    private authservice:AuthService,
    private router : Router,
    private flashmessage : FlashMessagesService) {

    }

  ngOnInit() {
    console.log("navbar init")
    this.authservice.castStudent.subscribe(studentLoggedIn => this.dummyStudentLoggedIn = studentLoggedIn);
    this.authservice.castProfessor.subscribe(professorLoggedIn => this.dummyProfessorLoggedIn = professorLoggedIn);
    this.authservice.castAdmin.subscribe(adminLoggedIn => this.dummyAdminLoggedIn = adminLoggedIn)
    // console.log(this.authservice.loggedIn())
  }

  onLogoutClick(){
    // console.log(this.dummyUserLoggedIn);
    if(this.dummyStudentLoggedIn || this.dummyProfessorLoggedIn || this.dummyAdminLoggedIn){
    this.authservice.userIsNowLoggedOut();
    this.authservice.logout();
    this.flashmessage.show('You are now logged out', {
      cssClass : 'alert-success',
      timeout:1500
    })
    this.router.navigate(['/login']);
    return false;
  }
}

  onExamClick(){
    if(this.dummyStudentLoggedIn){
      this.router.navigate(['/exam']);
      return false;
    }

  }

}
