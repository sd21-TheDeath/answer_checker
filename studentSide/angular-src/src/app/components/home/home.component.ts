import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  dummyStudentLoggedIn : boolean;
  dummyProfessorLoggedIn : boolean;
  dummyAdminLoggedIn : boolean;
  constructor(private authservice:AuthService) { }

  ngOnInit() {
    this.authservice.castStudent.subscribe(studentLoggedIn => this.dummyStudentLoggedIn = studentLoggedIn);
    this.authservice.castProfessor.subscribe(professorLoggedIn => this.dummyProfessorLoggedIn = professorLoggedIn);
    this.authservice.castAdmin.subscribe(adminLoggedIn => this.dummyAdminLoggedIn = adminLoggedIn)
    
  }

}
