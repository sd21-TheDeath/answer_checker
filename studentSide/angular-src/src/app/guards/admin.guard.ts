import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService} from '../services/auth.service';
import 'rxjs/add/operator/map';
@Injectable()
export class AdminGuard implements CanActivate{
    dummyStudentLoggedIn : boolean;
    dummyProfessorLoggedIn : boolean;
    dummyAdminLoggedIn : boolean;

    constructor( private authService : AuthService, private router:Router){}

    canActivate(){
        // this.authService.castStudent.subscribe(studentLoggedIn => this.dummyStudentLoggedIn = studentLoggedIn);
        // this.authService.castProfessor.subscribe(professorLoggedIn => this.dummyProfessorLoggedIn = professorLoggedIn);
        this.authService.castAdmin.subscribe(adminLoggedIn => this.dummyAdminLoggedIn = adminLoggedIn)

        if(this.dummyAdminLoggedIn){
            return true;
        }
        else{
            this.router.navigate(['']);
            return false;
        }
    }
}