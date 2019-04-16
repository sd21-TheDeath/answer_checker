import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService} from '../services/auth.service';
import 'rxjs/add/operator/map';
@Injectable()
export class AuthGuard implements CanActivate{
    dummyStudentLoggedIn : boolean;
    dummyProfessorLoggedIn : boolean;
    dummyAdminLoggedIn : boolean;

    constructor( private authService : AuthService, private router:Router){}

    // ng on init was not working!!!!!!!!!
    // ngOnInit() {
    //     console.log("guard init")
    //     this.authService.castStudent.subscribe(studentLoggedIn => this.dummyStudentLoggedIn = studentLoggedIn);
    //     this.authService.castProfessor.subscribe(professorLoggedIn => this.dummyProfessorLoggedIn = professorLoggedIn);
    //     this.authService.castAdmin.subscribe(adminLoggedIn => this.dummyAdminLoggedIn = adminLoggedIn)
    //     // console.log(this.authservice.loggedIn())
    //   }

    canActivate(){
        // console.log("guard init")
        this.authService.castStudent.subscribe(studentLoggedIn => this.dummyStudentLoggedIn = studentLoggedIn);
        this.authService.castProfessor.subscribe(professorLoggedIn => this.dummyProfessorLoggedIn = professorLoggedIn);
        this.authService.castAdmin.subscribe(adminLoggedIn => this.dummyAdminLoggedIn = adminLoggedIn)
        
        console.log(this.dummyStudentLoggedIn)
        console.log(this.dummyAdminLoggedIn)
        console.log(this.dummyProfessorLoggedIn)
        if(this.dummyStudentLoggedIn || this.dummyAdminLoggedIn || this.dummyProfessorLoggedIn){
            return true;
        }
        else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}