import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import * as securels from 'secure-ls';
import { LoginModel } from '../models/login-model';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private serverUrl = 'http://10.62.10.28:8080/socket'
  private title = 'WebSockets chat';
  private stompClient;

  loginForm: FormGroup
  ls = new securels({ encodingType: 'aes' });
  isRequired: boolean = true;

  constructor(private auth: AuthenticateService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      // password: new FormControl(''),
    });
  }

  ngOnInit() {
    this.initializeWebSocketConnection();

  }

  verify() {
    if (this.loginForm.valid) {
      $('#verify').modal('show')
      // console.log('ok');
    } else {
      alert('Silahkan masukan username')
    }
    console.log("test");
    window.open('C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE')
  }

  onSubmit() {
    let authenticate = new LoginModel;
    authenticate.password = this.loginForm.value.username;
    authenticate.username = this.loginForm.value.username;

    this.auth.authenticate(authenticate).subscribe(data => {
      console.log(data.status);
      if (data.status === 500) {
      } else {
        this.router.navigate(['dashboard']);
        this.ls.set('user', data);
      }
    })
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe("/socet", (message) => {
        if (message.body) {
          $(".chat").append("<div class='message'>" + message.body + "</div>")
          console.log(message.body);
        }
      });
    });
  }







}
