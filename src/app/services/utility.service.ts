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

  getDate(){
    var log = new Date();
    return moment(log).format('DD/MM/YYYY');
  }

  getTime(){
    var log = new Date();
    return moment(log).format('HH:mm');
  }


}
