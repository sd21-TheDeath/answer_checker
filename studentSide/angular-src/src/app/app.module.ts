import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatNativeDateModule, MatIconModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatStepperModule} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ExamComponent } from './components/exam/exam.component';

import {ValidateService} from './services/validate.service';
import {AuthService} from './services/auth.service';
import { TestService } from './services/test.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import { AuthGuard} from './guards/auth.guard';
import { RegisterProfessorComponent } from './components/register-professor/register-professor.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { CreatetestComponent } from './components/createtest/createtest.component';
const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]}, //registerprofessor
  {path:'registerprofessor', component: RegisterProfessorComponent},
  {path:'changepass', component: ChangepasswordComponent},
  {path:'forgetpass', component: ForgetpasswordComponent},
  {path:'exam', component: ExamComponent},
  {path:'createtest', component: CreatetestComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    ExamComponent,
    RegisterProfessorComponent,
    ChangepasswordComponent,
    CreatetestComponent,
    ForgetpasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    CdkStepperModule,
    MatStepperModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    MatTabsModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    TestService,
    MatDatepickerModule,
    MatInputModule,
    MatExpansionModule,
    CdkStepperModule,
    MatTabsModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatStepperModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
