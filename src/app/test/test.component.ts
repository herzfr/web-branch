import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import * as crypto from 'crypto-js';
import * as moment from 'moment';
import { NgForm, FormControl } from '@angular/forms';
import { TestService } from './test.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { FormCanDeactivate } from '../utility/form-can-deactivate/form-can-deactivate';
import * as SecureLS from 'secure-ls';

declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  private serverUrl = 'https://192.168.137.1:8444/socket';
  private stompClient;

  ls = new SecureLS({ encodingType: 'aes' });

  @ViewChild('form', { static: false }) form: NgForm;

  private secretKey: string;
  private userNameModel: any = {};

  private name = new FormControl('');
  message: string;

  userId: String;

  submit() {
    console.log(this.form.submitted);
  }

  @ViewChild('UserNameForm', { static: false }) UserNameForm: NgForm;

  constructor(private testService: TestService) {
    var dateNow = btoa(moment(new Date()).format("DDMMYYYYDDMM"));
    var key = crypto.enc.Utf8.parse(dateNow);
    this.secretKey = key;

    let user = JSON.parse(this.ls.get('data'));
    this.userId = user.userid;

    console.log("user", user);
    console.log("user id ", this.userId);

    
  }

  ngOnInit() {

    console.log();

    this.initializeWebSocketConnection("vldspv"+ this.userId);



  }

  testing() {
    var encrypted = this.encrypt(this.name.value);
    console.log("encrypt aes : ", encrypted);
    console.log("decrypt aes : ", this.decrypt(encrypted));

    this.testService.testSending(btoa(encrypted)).subscribe(resp => {
      console.log(resp);
    });
  }

  encrypt(word) {
    var someDate = moment(new Date()).format("DDMMYYYY");
    var srcs = crypto.enc.Utf8.parse(word);
    var encrypted = crypto.AES.encrypt(srcs, this.secretKey, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
    return encrypted.toString();
  }

  decrypt(word) {
    var decrypt = crypto.AES.decrypt(word, this.secretKey, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
    return crypto.enc.Utf8.stringify(decrypt).toString();
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {
      // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });

      that.stompClient.subscribe("/" + socket, (message) => {
        if (message.body) {
          return message.body;
        }

      }, () => {
        // that.dialog.errorDialog("Error", "Koneksi Terputus");
        console.log("koneksi terputus");

      });
    }, err => {
      console.log("gagal menghubungkan ke server ");

      // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }

  disconnect() {
    this.stompClient.disconnect();
  }

}
