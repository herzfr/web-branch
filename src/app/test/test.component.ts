import { Component, OnInit, ViewChild } from '@angular/core';

import * as crypto from 'crypto-js';
import * as moment from 'moment';
import { NgForm, FormControl } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  private secretKey: string;
  private userNameModel: any = {};

  name = new FormControl('');

  @ViewChild('UserNameForm', { static: false }) UserNameForm: NgForm;

  constructor() {
    var dateNow = moment(new Date()).format("DDMMYYYY");
    var salt = "WOLbbbFs6" + dateNow;
console.log("salt : ", salt);

    var key = crypto.enc.Utf8.parse(salt);
    this.secretKey = key;

  }

  ngOnInit() {
  }


  testing() {
    var encrypted = this.encrypt(this.name.value);
    console.log("encrypt aes : ", encrypted);
    console.log("decrypt aes : ", this.decrypt(encrypted));



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
