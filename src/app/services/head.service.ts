import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import * as securels from 'secure-ls';
import { AppConfiguration } from '../models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class HeadService {

  private apiUrl;
  private apiSocket;

  ls = new securels({ encodingType: 'aes' });
  token = this.ls.get('token')

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };

  constructor(private appConfiguration: AppConfiguration, private http: HttpClient) {
    this.apiUrl = this.appConfiguration.ipSocketServer;
    this.apiSocket = this.appConfiguration.ipSocketServer;
    console.log(this.ls.get('token'));
  }


  getDataReqOtorisation(stt, intv) {

    const params = new HttpParams()
      .set('state', stt)
      .set('timeInterval', intv)

    return this.http.get(this.apiUrl + 'api/wbheadvalidation/getnew?' + params, this.httpOptions)
  }

  setState(stt, transId, reject, usr) {

    // const params = new HttpParams()
    //   .set('state', stt)
    //   .set('transId', transId)
    //   .set('rejectedstate', reject)
    //   .set('user', usr)

    return this.http.put(this.apiUrl + 'api/wbheadvalidation/setstate?state=' + stt + '&transId=' + transId + '&rejectedstate=' + reject + '&user=' + usr, this.httpOptions)
  }





}
