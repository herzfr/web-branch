import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { Router } from '@angular/router';
import * as securels from 'secure-ls';
import { LoginModel } from '../models/login-model';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { DataBranchServices } from '../services/data-branch.service';

declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login.component.scss']
})
export class LoginComponent implements OnInit {

  private serverUrl = 'http://10.62.10.28:8080/socket'
  private stompClient;

  private branch;
  private terminal;
  private selectedBranch;
  private selectedTerm;
  private selectedIp;
  private isChossed = true;

  loginForm: FormGroup
  ls = new securels({ encodingType: 'aes' });
  isRequired: boolean = true;

  constructor(private auth: AuthenticateService, private router: Router, private dataBranch: DataBranchServices) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      // password: new FormControl(''),
    });
  }

  ngOnInit() {

    let ip = localStorage.getItem('IP');
    if (ip == null || ip == undefined) {
      this.dataBranch.getIp().subscribe(res => {
        this.selectedIp = res['ipadd'];
        localStorage.setItem('IP', this.selectedIp)
      }, err => {
        console.log(err);
      })
    } else {
      localStorage.removeItem('IP')
      this.dataBranch.getIp().subscribe(res => {
        this.selectedIp = res['ipadd'];
        localStorage.setItem('IP', this.selectedIp)
      }, err => {
        console.log(err);
      })
    }


    // this.initializeWebSocketConnection();
    let term = localStorage.getItem('terminal');
    if (term == null) {

      $('#modalTerm').modal('show')
      $('.container-fluid').addClass('modalBlur');

      this.dataBranch.getBranchAll().subscribe((res) => {
        console.log(res);
        this.branch = res;
      })
    } else {
      console.log("ada");
    }
  }

  verify() {


    if (this.loginForm.valid) {
      $('#verify').modal('show')
      $('.container-fluid').addClass('modalBlur');
      var ipSocket = this.selectedIp.split(".").join("")
      var userName = this.loginForm.get('username').value;
      var socket = "log" + ipSocket + "x" + userName;

      console.log("destination : ", socket);

      this.initializeWebSocketConnection(socket);



    } else {
      alert('Silahkan masukan username')
    }
    console.log("test");
    // window.open('C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE')
  }

  onSubmit() {
    let authenticate = new LoginModel;
    authenticate.password = this.loginForm.value.username;
    authenticate.username = this.loginForm.value.username;

    $('#verify').modal('hide')
    $('.container-fluid').removeClass('modalBlur');

    this.router.navigate(['/dashboard'])

    // this.auth.authenticate(authenticate).subscribe(data => {
    //   console.log(data.status);
    //   if (data.status === 500) {
    //   } else {
    //     this.router.navigate(['dashboard']);
    //     this.ls.set('user', data);
    //   }
    // })
  }

  transform(value: string): string {
    return value.split(".").join("")
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {

      console.log("connected tersambung");


      that.stompClient.subscribe("/" + socket, (message) => {

        console.log(JSON.parse(message.body));

        if (message.body) {




          const body = JSON.parse(message.body);
          console.log(body.success);

          if (body.success) {
            $('#verify').modal('hide')
            $('.container-fluid').removeClass('modalBlur');
            that.router.navigate(['/dashboard']);
          }



        }
      }, err => {
        console.log(err);


      });
    });
  }

  onChangeBranch() {
    this.dataBranch.getTerminalId(this.selectedBranch).subscribe(res => {
      console.log(res);
      this.terminal = res;
    }, err => {
      console.log(err);
      this.isChossed = true;
    })

    setTimeout(() => {
      console.log(this.terminal);
      if (this.terminal.length > 0) {
        console.log("ada");
        this.isChossed = false;
      } else {
        console.log("gak ada");
        this.isChossed = true;
      }
    }, 100)
  }


  postTerm() {
    console.log(this.selectedIp);


    var term: any = [{
      "terminalID": this.selectedTerm,
      "branchCode": this.selectedBranch,
    }]

    localStorage.setItem('terminal', JSON.stringify(term))
    $('#modalTerm').modal('hide');
    $('.container-fluid').removeClass('modalBlur');

    console.log(term);
  }

  callLoginApp() {
    console.log("open app");
    this.auth.openLoginApp().subscribe((response) => {
      console.log(response);
      this.verify();
      

    }, (error) => {
      alert("Error, Aplikasi FingerScan Tidak Meresponse");
    });

  }






}
