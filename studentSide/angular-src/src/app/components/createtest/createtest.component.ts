import { Component, OnInit } from '@angular/core';
import {TestService} from '../../services/test.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
//import { collectAndResolveStyles } from '@angular/core/src/animation/animation_style_util';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-createtest',
  templateUrl: './createtest.component.html',
  styleUrls: ['./createtest.component.css']
})
export class CreatetestComponent implements OnInit {
  public myForm: FormGroup; // our form model
  panelOpenState = false;
  constructor(private _fb: FormBuilder,
    private testservice:TestService,
    private flashmessage : FlashMessagesService,
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
          tags: ['',[Validators.required]],
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
    const test = this.myForm.value;
    console.log(test);
    this.testservice.createTest(test).subscribe(data => {
      if(data.success)
      {
        this.flashmessage.show('Test created successfully', {
          cssClass : 'alert-success',
          timeout:3000});
        this.router.navigate(['dashboard'])
      }
      else
      {
        this.flashmessage.show('Provide all required values', {
          cssClass : 'alert-danger',
          timeout:3000});
      }
    });
  }
}
