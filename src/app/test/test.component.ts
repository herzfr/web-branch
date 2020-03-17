import { Component, OnInit, ViewChild } from '@angular/core';

import * as crypto from 'crypto-js';
import * as moment from 'moment';
import { NgForm, FormControl } from '@angular/forms';
import { TestService } from './test.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  private secretKey: string;
  private userNameModel: any = {};

  name = new FormControl('');


  private serverUrl = "http://localhost:1111";
  private stompClient;


  @ViewChild('UserNameForm', { static: false }) UserNameForm: NgForm;

  constructor(private testService: TestService) {
    var dateNow = btoa(moment(new Date()).format("DDMMYYYYDDMM"));
    console.log(dateNow);

    var key = crypto.enc.Utf8.parse(dateNow);
    // var key = crypto.enc.Utf8.parse("abcdefgabcdefg12");

    this.secretKey = key;

    console.log(this.secretKey);

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
    // var key = crypto.enc.Utf8.parse(someDate);
    // console.log("key enc : ", key);

    var srcs = crypto.enc.Utf8.parse(word);
    var encrypted = crypto.AES.encrypt(srcs, this.secretKey, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
    return encrypted.toString();
  }

  decrypt(word) {
    // var someDate = moment(new Date()).format("DDMMYYYY").toString();
    // console.log("decrypt pass:", someDate);

    // var key = crypto.enc.Utf8.parse(someDate);
    // console.log("key :", key);


    var decrypt = crypto.AES.decrypt(word, this.secretKey, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
    return crypto.enc.Utf8.stringify(decrypt).toString();
  }

}
