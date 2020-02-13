import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import * as securels from 'secure-ls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  ls = new securels({ encodingType: 'aes' });

  constructor(private auth: AuthenticateService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
  }


  onSubmit() {
    this.auth.authenticate(this.loginForm.value.username, this.loginForm.value.password).subscribe(data => {
      console.log(data.status);

      if (data.status === 500) {

      } else {
        this.router.navigate(['dashboard']);
        this.ls.set('user', data);
      }
      // if(data.sta){}
      // if (data) {
      //   this.router.navigate(['home'])
      //   this.ls.set('user', data)
      // } else {
      //   alert('tidak ada')
      // }

    })
  }

}
