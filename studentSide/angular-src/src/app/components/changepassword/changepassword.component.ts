import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  username : String;
  password : String;
  newPassword : String;
  constructor(
    private authservice:AuthService,
    private router : Router,
    private flashmessage : FlashMessagesService) { }

  ngOnInit() {
  }

  changePassword(){
    
    const user = {
      username : this.username,
      password : this.password
    }

    this.authservice.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authservice.storeUserData(data.token, data.user);
        if(data.user.profession == "student"){
          const jsonToSend = {
            username : this.username,
            password : this.password,
            newPassword : this.newPassword
          }

          this.authservice.changePassword(jsonToSend).subscribe(data => {
            if(data.success){
              localStorage.clear();
              this.authservice.userIsNowLoggedOut();
              this.authservice.logout();
              this.flashmessage.show('password changed successfully', {
                cssClass : 'alert-success',
                timeout:1500
              })
              this.router.navigate(['/login']);
            }
          });
        }
        else {
          this.flashmessage.show('something went wrong', {
            cssClass : 'alert-danger',
            timeout:1500});
        }
        this.router.navigate(['dashboard']);
      }else{
        this.flashmessage.show(data.msg, {
          cssClass : 'alert-danger',
          timeout:1500});
        this.router.navigate(['changepass']);
      }
    } )
  }
}
