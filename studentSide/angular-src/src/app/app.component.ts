import { Component, OnInit } from '@angular/core';
import {AuthService} from './services/auth.service';
import 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app works!';
  dummyStudentLoggedIn : boolean;
  dummyProfessorLoggedIn : boolean;
  dummyAdminLoggedIn : boolean;

  constructor(private authservice:AuthService){}
  ngOnInit() {
    this.authservice.castStudent.subscribe(studentLoggedIn => this.dummyStudentLoggedIn = studentLoggedIn);
    this.authservice.castProfessor.subscribe(professorLoggedIn => this.dummyProfessorLoggedIn = professorLoggedIn);
    this.authservice.castAdmin.subscribe(adminLoggedIn => this.dummyAdminLoggedIn = adminLoggedIn)
    // localStorage.clear();
    if(localStorage.getItem("user")){
    var a = localStorage.getItem("user")
    console.log("**************************")
    console.log(a)
    console.log(JSON.parse(a).profession)
    if(JSON.parse(a).profession == 'student'){
        this.dummyStudentLoggedIn = true;
        this.dummyAdminLoggedIn = false;
        this.dummyProfessorLoggedIn = false;
        this.authservice.studentIsNowLoggedIn();
    }
    else if(JSON.parse(a).profession == 'professor'){
        this.dummyStudentLoggedIn = false;
        this.dummyAdminLoggedIn = false;
        this.dummyProfessorLoggedIn = true;
        this.authservice.professorIsNowLoggedIn();
    }
    else if(JSON.parse(a).profession == 'admin'){
        this.dummyStudentLoggedIn = false;
        this.dummyAdminLoggedIn = true;
        this.dummyProfessorLoggedIn = false;
        this.authservice.adminIsNowLoggedIn();
    }
  }
  }
}
