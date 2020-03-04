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

import { LoginModel } from '../models/login-model';
import { UserData } from '../models/UserData';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


  private serverUrl = 'http://10.62.10.28:8080/socket'
  private stompClient;

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

  constructor(private auth: AuthenticateService, private router: Router, private dataBranch: DataBranchServices, private dialog: DialogService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required)
    });
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

    const term = localStorage.getItem('terminal');
    if (term == null) {
      $('#modalTerm').modal('show')
      $('.container-fluid').addClass('modalBlur');
      this.subData = this.dataBranch.getBranchAll().subscribe((res) => {
        this.branch = res;
      })
    }
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
    this.stompClient.connect({}, function (frame) {

      that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });

      that.stompClient.subscribe("/" + socket, (message) => {

        if (message.body) {

          const body = JSON.parse(message.body);
          that.secureLs.set("data", JSON.stringify(body.record));
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
    }, err => {
      this.isChossed = true;
    })

    setTimeout(() => {
      if (this.terminal.length > 0) {
        this.isChossed = false;
      } else {
        this.isChossed = true;
      }
    }, 100)
  }

  postTerm() {
    var term: any = [{
      "terminalID": this.selectedTerm,
      "branchCode": this.selectedBranch,
    }]
    localStorage.setItem('terminal', JSON.stringify(term))
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

