import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import * as crypto from 'crypto-js';
import * as moment from 'moment';
import { NgForm, FormControl } from '@angular/forms';
import { TestService } from './test.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { FormCanDeactivate } from '../utility/form-can-deactivate/form-can-deactivate';

declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  @ViewChild('form', { static: false }) form: NgForm;

  private secretKey: string;
  private userNameModel: any = {};

  private name = new FormControl('');
  message: string;

  submit() {
    console.log(this.form.submitted);
  }

  @ViewChild('UserNameForm', { static: false }) UserNameForm: NgForm;

  constructor(private testService: TestService) {
    var dateNow = btoa(moment(new Date()).format("DDMMYYYYDDMM"));
    var key = crypto.enc.Utf8.parse(dateNow);
    this.secretKey = key;
  }

  ngOnInit() {


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

}
