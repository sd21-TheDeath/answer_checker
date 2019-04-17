import { Component, OnInit } from '@angular/core';
import {TestService} from '../../services/test.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
//import { collectAndResolveStyles } from '@angular/core/src/animation/animation_style_util';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatSnackBar} from '@angular/material';

export interface Tag {
  name: string
}

@Component({
  selector: 'app-createtest',
  templateUrl: './createtest.component.html',
  styleUrls: ['./createtest.component.css']
})
export class CreatetestComponent implements OnInit {
  public myForm: FormGroup; // our form model
  panelOpenState = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [];
  constructor(private _fb: FormBuilder,
    private testservice:TestService,
    private flashmessage : FlashMessagesService,
    private snackBar: MatSnackBar,
    private router : Router) { }


  ngOnInit() {
      this.myForm = this._fb.group({
          batch: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
          program: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
          code: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
          startdate: ['',[Validators.required]],
          starthh: ['',[Validators.required]],
          startmm: ['',[Validators.required]],
          startss: ['',[Validators.required]],
          durationhh: ['',[Validators.required]],
          durationmm: ['',[Validators.required]],
          durationss: ['',[Validators.required]],
          qset: this._fb.array([
            this.initQuestion(),
          ]),
          tags: this._fb.array([]),
          description: ['',[Validators.required]]
      });
  }

  initQuestion(){
    return this._fb.group({
      q: [''],
      a: [''],
      m: [''],
    })
  }

  addQuestion(){
    const control = <FormArray>this.myForm.controls['qset'];
    control.push(this.initQuestion());
  }

  removeQuestion(i: number){
    const control = <FormArray>this.myForm.controls['qset'];
    control.removeAt(i);
  }

  onCreateTestSubmit(){
    console.log(this.tags);
    var j;
    for(j=0; j<this.tags.length; j++){
      const control = <FormArray>this.myForm.controls['tags'];
      control.push(this._fb.group({
        name: [this.tags[j].name]
      }));
    }
    const test = this.myForm.value;
    console.log(test);
    // let json = {
    //   tags : JSON.stringify(this.tags),
    //   course : test.code,
    //   batch : test.batch,
    //   examNo : test.number,
    //   program : test.program
    // }
    // console.log(json);
    // this.testservice.trainModel(json).subscribe(data => {
    //   console.log(data);
    // });
    this.testservice.createTest(test).subscribe(data => {
      if(data.success)
      {
        let json = {
          tags : JSON.stringify(this.tags),
          course : test.code,
          batch : test.batch,
          examNo : data.examNo,
          program : test.program
        }
        console.log(json);
        this.testservice.trainModel(json).subscribe(data => {
          console.log(data);
          this.snackBar.open('Test created successfully', 'Success', {
            duration: 3000,
          });
          // this.flashmessage.show('Test created successfully', {
          //   cssClass : 'alert-success',
          //   timeout:3000});
          this.router.navigate(['dashboard'])
        });
        // this.flashmessage.show('Test created successfully', {
        //   cssClass : 'alert-success',
        //   timeout:3000});
        // this.router.navigate(['dashboard'])
      }
      else
      {
        this.snackBar.open('Provide all required values', 'Error', {
          duration: 3000,
        });
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}
