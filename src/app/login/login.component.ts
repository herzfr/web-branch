import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { DataBranchServices } from '../services/data-branch.service';
import { Subscription } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { Router } from '@angular/router';
import * as securels from 'secure-ls';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as moment from 'moment';

import { LoginModel } from '../models/login-model';
import { AppConfiguration } from '../models/app.configuration';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private serverUrl = 'https://10.62.10.28:8444/socket'
  private stompClient;

  ls = new securels({ encodingType: 'aes' });

  private branch;
  private terminal;
  private selectedBranch;
  private selectedTerm;
  private selectedIp;
  private isChossed = true;
  private subOpenFinger: Subscription;
  private subCallApp: Subscription;
  private subData: Subscription;

  loginForm: FormGroup
  secureLs = new securels({ encodingType: 'aes' });
  isRequired: boolean = true;

  constructor(private auth: AuthenticateService, private router: Router, private dataBranch: DataBranchServices, private dialog: DialogService, private appConfig: AppConfiguration) {

    try {
      let user = JSON.parse(this.ls.get('data'));
      if (user) {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      // console.log("no user data ");
    }

    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required)
    });

    this.serverUrl = appConfig.ipSocketServer + "socket";
  }

  ngOnInit() {
    const ip = localStorage.getItem('IP');
    if (ip == null || ip == undefined) {
      this.subData = this.dataBranch.getIp().subscribe(res => {
        this.selectedIp = res['ipadd'];
        localStorage.setItem('IP', this.selectedIp)
      }, err => {
        this.dialog.errorDialog("Error", "Gagal Terhubung Ke Server");
      })
    } else {
      localStorage.removeItem('IP')
      this.subData = this.dataBranch.getIp().subscribe(res => {
        this.selectedIp = res['ipadd'];
        localStorage.setItem('IP', this.selectedIp)
      }, err => {
        this.dialog.errorDialog("Error", "Gagal Terhubung Ke Server");
      })
    }

    // const term = localStorage.getItem('terminal');
    try {
      JSON.parse(this.secureLs.get("terminal"));
    } catch (error) {
      $('#modalTerm').modal('show')
      $('.container-fluid').addClass('modalBlur');
      this.subData = this.dataBranch.getBranchAll().subscribe((res) => {
        this.branch = res;
      })
    }


    // if (term === null ) {
    //   $('#modalTerm').modal('show')
    //   $('.container-fluid').addClass('modalBlur');
    //   this.subData = this.dataBranch.getBranchAll().subscribe((res) => {
    //     this.branch = res;
    //   })
    // }
  }

  verify() {
    if (this.loginForm.valid) {
      if (this.selectedIp === undefined) {
        this.dialog.errorDialog("Error", "Gagal Terhubung Ke Server")
      } else {
        $('#verify').modal('show')
        $('.container-fluid').addClass('modalBlur');
        var ipSocket = this.selectedIp.split(".").join("")
        var userName = this.loginForm.get('username').value;
        var socket = "log" + ipSocket + "x" + userName;
        this.initializeWebSocketConnection(socket);
      }
    } else {
      alert('Silahkan masukan username')
    }
  }

  onSubmit() {
    let authenticate = new LoginModel;
    authenticate.password = this.loginForm.value.username;
    authenticate.username = this.loginForm.value.username;

    $('#verify').modal('hide')
    $('.container-fluid').removeClass('modalBlur');

    this.router.navigate(['/dashboard'])
  }

  transform(value: string): string {
    return value.split(".").join("")
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {
      that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });

      that.stompClient.subscribe("/" + socket, (message) => {

        if (message.body) {
          const body = JSON.parse(message.body);
          that.secureLs.set("data", JSON.stringify(body.record));
          that.secureLs.set("termdata", JSON.stringify(body.record.userterminal));
          that.secureLs.set("token", body.token);
          that.secureLs.set("iat", Date.now());
          if (body.success) {
            $('#verify').modal('hide')
            $('.container-fluid').removeClass('modalBlur');
            that.router.navigate(['/home']);
            that.stompClient.disconnect();
          }
        }
      }, () => {
        that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }

  onChangeBranch() {
    this.subData = this.dataBranch.getTerminalId(this.selectedBranch).subscribe(res => {
      this.terminal = res;
      this.isChossed = false
    }, err => {
      this.isChossed = true;
    })

    // console.log(this.terminal.length);

    // setTimeout(() => {
    //   if (this.terminal.length > 0) {
    //     this.isChossed = false;
    //   } else {
    //     this.isChossed = true;
    //   }
    // }, 100)
  }

  postTerm() {
    var term: any = {
      "terminalID": this.selectedTerm,
      "branchCode": this.selectedBranch,
    }
    this.secureLs.set("terminal", JSON.stringify(term));
    // localStorage.setItem('terminal', JSON.stringify(term))
    $('#modalTerm').modal('hide');
    $('.container-fluid').removeClass('modalBlur');
  }

  callLoginApp() {
    this.subCallApp = this.auth.callLoginApp().subscribe(() => {
      this.verify();
    }, () => {
      this.dialog.errorDialog("Error, Aplikasi FingerScan Tidak Meresponse", "Atau Aplikasi Belum Di Jalankan");
    });
  }

  ngOnDestroy(): void {
    if (this.subData) {
      this.subData.unsubscribe();
    }
    if (this.subCallApp) {
      this.subCallApp.unsubscribe();
    }
    if (this.subOpenFinger) {
      this.subOpenFinger.unsubscribe();
    }
  }

  onCancel() {
    $('#verify').modal('hide')
    $('.container-fluid').removeClass('modalBlur');
    this.stompClient.disconnect();
  }

}

