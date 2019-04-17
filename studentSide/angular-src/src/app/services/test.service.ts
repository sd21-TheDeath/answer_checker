import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class TestService {
  constructor(private http: Http) { }
  createTest(test){
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    return this.http.post(' http://localhost:3000/tests/createtest', test, {headers:headers})
    .pipe(map(res => res.json()));
  }
  getExamsFromDb(json){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("auth service")
    return this.http.post('http://localhost:3000/tests/gettest',json, {headers:headers})
    .map(res => res.json());
  }

  trainModel(json){
    console.log(json)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/trainmodel',json, {headers:headers})
    .map(res => res.json());
  }

}
