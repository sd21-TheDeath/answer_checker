import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { totalmem } from 'os';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { tokenNotExpired } from 'angular2-jwt'
// import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class AuthService {
  authToken : any;
  user : any;
  // userLoggedIn = false;
  private studentLoggedIn = new BehaviorSubject<boolean>(false);
  private professorLoggedIn = new BehaviorSubject<boolean>(false);
  private adminLoggedIn = new BehaviorSubject<boolean>(false);
  castStudent = this.studentLoggedIn.asObservable();
  castProfessor = this.professorLoggedIn.asObservable();
  castAdmin = this.adminLoggedIn.asObservable();

  constructor(private http: Http) { }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    return this.http.post(' http://localhost:3000/users/register', user, {headers:headers})
    .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers:headers})
    .map(res => res.json());
  }

  getProfile(username){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('requestedUsername', username);
    return this.http.post('http://localhost:3000/users/profile', {headers:headers})
    .map(res => res.json());
  }

  getStudentProfile(username){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('requestedUsername', username);
    return this.http.post('http://localhost:3000/users/studentprofile', {headers:headers})
    .map(res => res.json());
  }

  storeStudentProfile(json){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/storestudentprofile',json, {headers:headers})
    .map(res => res.json());
  }

  checkAnswers(json){
    console.log("check ansers")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/checkanswers',json, {headers:headers})
    .map(res => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    // console.log('here 3:26')
    localStorage.clear();
  }

  studentIsNowLoggedIn(){
    this.studentLoggedIn.next(true);
    this.professorLoggedIn.next(false);
    this.adminLoggedIn.next(false);
    // return true;
  }

  professorIsNowLoggedIn(){
    this.professorLoggedIn.next(true);
    // return true;
  }

  adminIsNowLoggedIn(){
    this.adminLoggedIn.next(true);
    // return true;
  }

  userIsNowLoggedOut(){
    this.studentLoggedIn.next(false);
    this.professorLoggedIn.next(false);
    this.adminLoggedIn.next(false);
    // return true;
  }


  // examTemp(){
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.post('http://localhost:3000/users/exam', {headers:headers})
  //   .map(res => res.json());
  // }


  getMarks(answers){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/runpy', answers, {headers:headers})
    .map(res => res.json());
  }

  loggedIn(){
    return tokenNotExpired();
  }

  changePassword(json){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("auth service")
    return this.http.post('http://localhost:3000/users/changepassword',json, {headers:headers})
    .map(res => res.json());
  }

  generateOTP(json){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("auth service")
    return this.http.post('http://localhost:3000/users/sendotp',json, {headers:headers})
    .map(res => res.json());
  }

  changePasswordThroughOTP(json){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("auth service")
    return this.http.post('http://localhost:3000/users/changepasswordotp',json, {headers:headers})
    .map(res => res.json());
  }

  getCorrespondingExams(batch){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("auth service")
    return this.http.post('http://localhost:3000/test/getbatchexams',batch, {headers:headers})
    .map(res => res.json());
  }
}
