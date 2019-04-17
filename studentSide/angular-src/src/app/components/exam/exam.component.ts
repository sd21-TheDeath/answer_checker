import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AuthService} from '../../services/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { prepareProfile } from 'selenium-webdriver/firefox';
import {TestService} from '../../services/test.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
//import { collectAndResolveStyles } from '@angular/core/src/animation/animation_style_util';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
//import {Observable} from '@reactivex/rxjs/es6/Observable.js'
// import {BrowserAnimationsModule} from '@angular/platform-browser';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  public myForm : FormGroup;
  questions : any;
  starting_hour : any;
  starting_min : any;
  starting_sec : any;
  duration_hour: any;
  duration_min: any;
  duration_sec: any;
  seconds : any;
  seconds_counter : any;
  times_up : any;
  due_hour : any;
  due_min : any;
  due_sec : any;
  q1 : string;
  q2 : string;
  exam_num : number;
  examSelected = false;
  exam_taken = false;
  anyAnsSaved = false;
  pageRefreshed : boolean;
  check_1 : String;
  check_2 : String;
  examCourses : any;
  submitted_flag : any;///////
  arrOfStdProfile : any;///////
  dataOfAllExams : any;
  dataOfAllSubmissions: any;
  constructor(
    private authservice:AuthService,
    private testservice: TestService,
    private http: Http,
    private router: Router,
    private snackBar: MatSnackBar,
    private _fb : FormBuilder){

    }

  ngOnInit() {

    this.myForm = this._fb.group({
      ansSet : this._fb.array([])
    });

    this.authservice.getStudentProfile(JSON.parse(localStorage.getItem('user')).username).subscribe(profile => {
      // console.log(profile);
      this.dataOfAllSubmissions = Array(profile.length);
      this.dataOfAllSubmissions = profile;
    });

    if(localStorage.getItem('examTaken')){
      //console.log(JSON.parse(localStorage.getItem('ansSet')));
      //console.log('111111111');
      // console.log(this.myForm.value.ansSet)
      console.log(JSON.parse(localStorage.getItem('ansSet')).ansSet[0].ans);
      // var obj = JSON.parse(localStorage.getItem('ansSet'));
      // console.log(obj);
      // var j;
      // this.myForm.setValue(obj);
    }
    // this.myForm.valueChanges.subscribe(formData => {
    //   console.log(formData);
    //   localStorage.setItem('ansSet', JSON.stringify(formData));
    // });

    let json = {
      batch : "2016",
      program : "01"
    }

    this.testservice.getExamsFromDb(json).subscribe(data=>{
      console.log(data);
      this.dataOfAllExams = data;
      this.examCourses = Array(data.tests.length);
      this.times_up = Array(data.tests.length);
      this.submitted_flag = Array(data.tests.length);
      var i;
      var d = new Date();
      for(i=0; i<data.tests.length; i++){
        this.submitted_flag[i]=false;
        var found = this.dataOfAllSubmissions.find(function(ele){
          return ((ele.batch==data.tests[i].batch) &&
                  (ele.program==data.tests[i].program) &&
                  (ele.code==data.tests[i].code) &&
                  (ele.exam_number==data.tests[i].number));
        });
        if(found){
          this.submitted_flag[i]=true;
          console.log(i+" Submitted");
        }
        this.starting_hour = Number(data.tests[i].starthh);
        this.starting_min = Number(data.tests[i].startmm);
        this.starting_sec = Number(data.tests[i].startss);
        this.duration_hour = Number(data.tests[i].durationhh);
        this.duration_min = Number(data.tests[i].durationmm);
        this.duration_sec = Number(data.tests[i].durationss);

        var end_time = (this.starting_hour + this.duration_hour)*3600 +
                          (this.starting_min + this.duration_min)*60 +
                          (this.starting_sec + this.duration_sec);

        var cur_time=(d.getHours())*3600 + (d.getMinutes())*60 + d.getSeconds();
        var time_left=end_time-cur_time;

        var r_h = Math.floor(time_left/3600);
        var r_m = Math.floor((time_left - 3600*r_h)/60);
        var r_s = Math.floor((time_left - 3600*r_h - 60*r_m));

        this.seconds = (this.starting_hour - d.getHours())*3600 + (this.starting_min - d.getMinutes())*60 + (this.starting_sec-d.getSeconds());
        this.seconds_counter = this.seconds;
        if(this.seconds_counter<=0){
          this.times_up[i]=true;
          if(time_left<=0){
            if(this.submitted_flag[i]==false){
              this.submitted_flag[i]=true;
            }
            this.examCourses[i] = {
              "code": data.tests[i].code,
              "due_hour": "0",
              "due_min": "0",
              "due_sec": "0",
              "remhh": "0",
              "remmm": "0",
              "remss": "0",
              "description": data.tests[i].description
            }
          }
          else{
            this.examCourses[i] = {
              "code": data.tests[i].code,
              "due_hour": "0",
              "due_min": "0",
              "due_sec": "0",
              "remhh": r_h,
              "remmm": r_m,
              "remss": r_s,
              "description": data.tests[i].description
            }
          }
        }
        else{
          this.due_hour = Math.floor(this.seconds_counter/3600);
          this.due_min = Math.floor((this.seconds_counter - 3600*this.due_hour)/60);
          this.due_sec = Math.floor((this.seconds_counter - 3600*this.due_hour - 60*this.due_min ));
          this.examCourses[i] = {
            "code": data.tests[i].code,
            "due_hour": this.due_hour,
            "due_min": this.due_min,
            "due_sec": this.due_sec,
            "remhh": data.tests[i].durationhh,
            "remmm": data.tests[i].durationmm,
            "remss": data.tests[i].durationss,
            "description": data.tests[i].description
          }
          this.times_up[i]=false;
        }
      }
      setInterval(() => {
        for(i=0; i<data.tests.length; i++){
          if(this.times_up[i]){
            //console.log(time_left);
            if(time_left<=0){
              //do nothing
            }
            else if(this.examCourses[i].remss>0){
              this.examCourses[i].remss--;
            }
            else if(this.examCourses[i].remmm>0){
              this.examCourses[i].remss=59;
              this.examCourses[i].remmm--;
            }
            else if(this.examCourses[i].remhh>0){
              this.examCourses[i].remss=59;
              this.examCourses[i].remmm=59;
              this.examCourses[i].remhh--;
            }
            else{
              this.examCourses[i].remss=0;
              this.examCourses[i].remmm=0;
              this.examCourses[i].remhh=0;
              if(this.submitted_flag[i]==false){
                // this.onAnswerSubmitClick(i);
              }
            }
          }
          else if(this.examCourses[i].due_sec>0){
            this.examCourses[i].due_sec--;
          }
          else if(this.examCourses[i].due_min>0){
            this.examCourses[i].due_sec=59;
            this.examCourses[i].due_min--;
          }
          else if(this.examCourses[i].due_hour>0){
            this.examCourses[i].due_sec=59;
            this.examCourses[i].due_min=59;
            this.examCourses[i].due_hour--;
          }
          else{
            this.times_up[i]=true;
            this.examCourses[i].due_sec=0;
            this.examCourses[i].due_min=0;
            this.examCourses[i].due_hour=0;
          }
        }
      },1000);
      if(localStorage.getItem('examTaken')){

        this.pageRefreshed = true;
        if(localStorage.getItem('anyAnsSaved')){
          this.anyAnsSaved = true;
        }
        var index = Number(localStorage.getItem('examChosen'));
        console.log(index);
        this.times_up[index] = true;
        this.exam_taken = true;
        console.log("8:02")
        this.onButtonClick(index);
        // var i;
        // this.authservice.examTemp().subscribe(data => {
        //   console.log(data);
        //   console.log(data.questions);
        //   this.questions = data.questions;
        //   // this.q2 = data.questions.q2.q;

        // });
      }
      // else {
      // this.times_up[] = false;
      // this.exam_taken = false;
      // }
    });

    // this.testservice.getExamsFromDb(json).subscribe(data => {
    //   console.log(data);
    //   this.dataOfAllExams = data;
    //   this.examCourses = Array(data.tests.length);
    //   var i;
    //   for(i=0; i<data.tests.length; i++){
    //     this.examCourses[i] = data.tests[i].code;
    //   }
    // });

    // if(localStorage.getItem('examTaken')){
    //
    //   this.pageRefreshed = true;
    //   if(localStorage.getItem('anyAnsSaved')){
    //     this.anyAnsSaved = true;
    //   }
    //   var index = Number(localStorage.getItem('examChosen'));
    //   console.log(index);
    //   this.times_up[index] = true;
    //   this.exam_taken = true;
    //   console.log("8:02")
    //   this.onButtonClick();
    //   // var i;
    //   // this.authservice.examTemp().subscribe(data => {
    //   //   console.log(data);
    //   //   console.log(data.questions);
    //   //   this.questions = data.questions;
    //   //   // this.q2 = data.questions.q2.q;
    //
    //   // });
    // } else {
    // this.times_up = false;
    // this.exam_taken = false;
    // }
    //************************************
    // this.starting_hour = 14;
    // this.starting_min = 55;
    // this.starting_sec = 0;
    //************************************


    // console.log(Math.floor(10/8));
  }

  initAnswer(temp: string, i: number){
    //console.log(temp);
    var obj='';
    console.log(i);
    // console.log(JSON.parse(localStorage.getItem('ansSet')).ansSet);
    if(localStorage.getItem('ansSet')) {
      obj = JSON.parse(localStorage.getItem('ansSet')).ansSet[i].ans;
    }
    //console.log(obj);
    return this._fb.group({
      question: [temp],
      ans: [obj],
    });
    //console.log("ac");
  }

  addAnswer(temp: string, i: number){
    const control = <FormArray>this.myForm.controls['ansSet'];
    control.push(this.initAnswer(temp,i));
  }

  loadAnswers(){
    var i;
    for(i=0; i<this.questions.length; i++){
      if(<HTMLInputElement>document.getElementById("answer" + (i+1))){
        console.log('found element')
        if(localStorage.getItem('ans' + i)){
          console.log('setting value');
          console.log(localStorage.getItem('ans' + i));
          (<HTMLInputElement>document.getElementById("answer" + (i+1))).value = localStorage.getItem('ans' + i);
        }
      }
    }
  }

  saveAnswers(arg){
    // console.log('xxxxxxxxxxxxxxxxx')
    // console.log(arg)
    this.anyAnsSaved = true;
    localStorage.setItem('anyAnsSaved','true');
    var i = arg;
      if(<HTMLInputElement>document.getElementById("answer" + (i+1))){
      localStorage.setItem('ans' + i,(<HTMLInputElement>document.getElementById("answer" + (i+1))).value);
    }
  }

  courseSelection(arg){
    // console.log(this.dataOfAllExams.tests[arg])
    console.log("Here");
    console.log(this.dataOfAllExams);
    console.log(Number(this.dataOfAllExams.tests[arg].starthh));
    this.questions = this.dataOfAllExams.tests[arg].qset;
    this.starting_hour = Number(this.dataOfAllExams.tests[arg].starthh);
    this.starting_min = Number(this.dataOfAllExams.tests[arg].startmm);
    this.starting_sec = Number(this.dataOfAllExams.tests[arg].startss);
    this.examSelected = true;
    //console.log(this.questions);
    var i;
    for(i=0; i<this.questions.length; i++){
      this.addAnswer(this.questions[i].q,i);
    }
    this.myForm.valueChanges.subscribe(formData => {
      console.log(formData);
      localStorage.setItem('ansSet', JSON.stringify(formData));
    });
    var d = new Date();
    this.seconds = (this.starting_hour - d.getHours())*3600 + (this.starting_min - d.getMinutes())*60 + (this.starting_sec-d.getSeconds());
    this.seconds_counter = this.seconds;
    setInterval(() => {
      if(this.times_up[arg] == false){
        this.due_hour = Math.floor(this.seconds_counter/3600);
        this.due_min = Math.floor((this.seconds_counter - 3600*this.due_hour)/60);
        this.due_sec = Math.floor((this.seconds_counter - 3600*this.due_hour - 60*this.due_min ));
        this.seconds_counter--;
      }
      if(this.seconds_counter <= 0){
        this.times_up[arg] = true;
      }
    },1000);

  }
  onButtonClick(i: number){
    // document.getElementById("takeExamButton").style.display = "none";
    this.exam_taken = true;
    this.exam_num = i;
    console.log(i);
    localStorage.setItem('examTaken',"true");
    localStorage.setItem('examChosen', String(i));
    // localStorage.setItem('ansSet',);
    console.log("Hii");
    this.courseSelection(i);
  }

  onAnswerSubmitClick(i: number){
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    //clear the local storage and change the booleans

    // console.log(this.myForm.value)
    if(this.submitted_flag[i]==false){
      console.log(i);
      this.submitted_flag[i]=true;
      let rawJson = JSON.parse(localStorage.getItem('user'));
      console.log("1");
      let sum=0;
      var j;
      for(j=0; j<this.questions.length; j++){
        sum += Number(this.questions[j].m);
      }
      console.log("2");
      
      console.log("3");
      
      let studAns = Array(this.myForm.value.ansSet.length);
      let profAns = Array(this.myForm.value.ansSet.length);
      
      for(j=0; j<this.myForm.value.ansSet.length; j++){
        studAns[j] = this.myForm.value.ansSet[j].ans + ':/5762*';
        profAns[j] = this.dataOfAllExams.tests[i].qset[j].a + ':/5762*';
      }


      let json2 = {
        examNo : this.dataOfAllExams.tests[i].number,
        username : JSON.parse(localStorage.getItem('user')).username,
        batch : this.dataOfAllExams.tests[i].batch,
        course : this.dataOfAllExams.tests[i].code,
        // professor : ,
        studentAnswers : studAns,
        professorAnswers : profAns,
        examDate : this.dataOfAllExams.tests[i].startdate,
        program : this.dataOfAllExams.tests[i].program
      }
      console.log(json2)
      this.authservice.checkAnswers(json2).subscribe(data=>{
        console.log(data);
      });

      let json = {
        sid : rawJson.name,
        name : rawJson.name,
        email : rawJson.email,
        batch : this.dataOfAllExams.tests[i].batch,
        program : this.dataOfAllExams.tests[i].program,
        code : this.dataOfAllExams.tests[i].code,
        exam_number : this.dataOfAllExams.tests[i].number,
        marks : "15",
        total_marks : "100"
      }

      this.authservice.storeStudentProfile(json).subscribe(data => {
        console.log("*************\n" + data);
        console.log("4");
        localStorage.removeItem('ansSet');
        localStorage.removeItem('examTaken');
        localStorage.removeItem('examChosen');
        this.router.navigate(['']);
        // this.ngOnInit();
      });

    }
    // const answers = {
    //   check_1 : (<HTMLInputElement>document.getElementById("answer1")).value,
    //   check_2 : (<HTMLInputElement>document.getElementById("answer2")).value
    // }
    // this.authservice.getMarks(answers).subscribe(data => {
    //   console.log("right place");
    //   console.log(data);
    // })
  }

  ansSubmitted(){
    // var ans1 = document.getElementById("answer1").value;
    var ans1 = (<HTMLInputElement>document.getElementById("answer1")).value;
    console.log(ans1);

  }

}
