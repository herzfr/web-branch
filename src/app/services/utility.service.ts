import { Injectable } from '@angular/core';
import * as moment from 'moment';

import * as angkaTerbilang from "@develoka/angka-terbilang-js";

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

  getDateWithoutSeparator() {
    var log = new Date();
    return moment(log).format('DD/MM/YYYY');
  }

  getDateWithDash() {
    var log = new Date();
    return moment(log).format('DD-MM-YYYY');
  }

  getDateTimeStamp() {
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


  numToWord() {

    var tens = ['', '', 'duapuluh', 'tigapuluh', 'empatpuluh', 'limapuluh', 'enampuluh', 'tujuhpuluh', 'delapanpuluh', 'sembilanpuluh'];
    var teens = ['sepuluh', 'sebelas', 'duabelas', 'tigabelas', 'empatbelas', 'limabelas', 'enambelas', 'tujuhbelas', 'delapanbelas', 'sembilanbelas'];



  }



  convert_trillions(num) {
    if (num >= 1000000000) {
      return this.convert_trillions(Math.floor(num / 1000000000000)) + " Milyar " + this.convert_billions(num % 1000000000000);
    } else {
      return this.convert_billions(num);
    }
  }

  convert_billions(num) {
    if (num >= 1000000000) {
      return this.convert_billions(Math.floor(num / 1000000000)) + " Milyar " + this.convert_millions(num % 1000000000);
    } else {
      return this.convert_millions(num);
    }
  }

  convert_millions(num) {
    if (num >= 1000000) {
      return this.convert_millions(Math.floor(num / 1000000)) + " juta " + this.convert_thousands(num % 1000000);
    } else {
      return this.convert_thousands(num);
    }
  }

  convert_thousands(num) {
    if (num >= 1000) {
      return this.convert_hundreds(Math.floor(num / 1000)) + " ribu " + this.convert_hundreds(num % 1000);
    } else {
      return this.convert_hundreds(num);
    }
  }

  convert_hundreds(num) {
    var ones = ['', 'seribu', 'duaribu', 'tigaribu', 'empatribu', 'limaribu', 'enamribu', 'tujuhribu', 'delapanribu', 'sembilanribu'];
    if (num > 99) {
      return ones[Math.floor(num / 100)] + " ratus " + this.convert_tens(num % 100);
    } else {
      return this.convert_tens(num);
    }
  }

  convert_tens(num) {
    var ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
    var tens = ['', '', 'duapuluh', 'tigapuluh', 'empatpuluh', 'limapuluh', 'enampuluh', 'tujuhpuluh', 'delapanpuluh', 'sembilanpuluh'];
    var teens = ['sepuluh', 'sebelas', 'duabelas', 'tigabelas', 'empatbelas', 'limabelas', 'enambelas', 'tujuhbelas', 'delapanbelas', 'sembilanbelas'];
    if (num < 10) return ones[num];
    else if (num >= 10 && num < 20) return teens[num - 10];
    else {
      return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    }
  }

  convert(num) {
    // console.log("angka terbilang : " + angkaTerbilang(num));

    if (num == 0) return "zero";
    else return angkaTerbilang(num.toString());
  }






}
