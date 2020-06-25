import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  ipAdd: string;
  lastLog: string;
  loginDate: string;

  constructor() { }

  getDateTime() {
    var log = new Date();
    return moment(log).format('DD/MM/YYYY HH:mm');
  }

  getRawDateTime() {
    let log = new Date();
    return moment(log).format('DDMMYYYYHHmm');
  }

  convertMilisToDateTime(value: number) {
    return moment.utc(value).format('DDMMYYYYHHmm');
  }
  
  convertMilisToDateTimeStamp(value: number) {
    return moment.utc(value).format('DDMMYYYYHHmmss');
  }


  getDate() {
    var log = new Date();
    return moment(log).format('DD/MM/YYYY');
  }

  getDateTimeStamp(){
    var log = new Date();
    return moment(log).format('DDMMYYYYHHmmss');
  }

  getTime() {
    var log = new Date();
    return moment(log).format('HH:mm');
  }

  leftPadding(value: string, padValue: string, length: number) {
    // console.log(value.padStart(length, padValue));
    return value.padStart(length, padValue);
  }

  rightPadding(value: string, padValue: string, length: number) {
    console.log(value.padEnd(length, padValue));
    return value.padEnd(length, padValue);
  }

  asciiToHexa(str) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push("00" + hex);
    }
    return arr1.join('').toUpperCase();
  }

  hexToAscii(str1) {
    let index = 0, index1 = 0;
    let encoded = str1.toString();
    let encodedLength = encoded.length;
    let cleanData = [];

    for (let i = 0; i < encodedLength; i += 2) {
      index += 2;
      if (index1 % 2 != 0) {
        let value = encoded.substring(i, index);
        cleanData.push(value);
      }
      index1++;
    }

    let hex = cleanData.join("").toString()
    let str = '';
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  


}
