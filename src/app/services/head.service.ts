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
    this.apiUrl = this.appConfiguration.ipServer;
    this.apiSocket = this.appConfiguration.ipSocketServer;
  }

  getDataReqOtorisation(stt, intv) {
    const params = new HttpParams()
      .set('state', stt)
      .set('timeInterval', intv)
    return this.http.get(this.apiSocket + 'api/wbheadvalidation/getnew?' + params, this.httpOptions)
  }

  setState(stt, transId, reject, usr) {
    return this.http.get(this.apiSocket + 'api/wbheadvalidation/setstate?state=' + stt + '&transId=' + transId + '&rejectedstate=' + reject + '&user=' + usr, this.httpOptions)
  }

  getDataReqOtoHeadCS(usrnm, brch, sts) {
    const params = new HttpParams()
      .set('username', usrnm)
      .set('branchcode', brch)
      .set('status', sts)
    return this.http.get(this.apiUrl + 'api/wbheadvalidation/getnewcs?' + params, this.httpOptions)
  }

  updateValidation(status, transId) {
    const params = new HttpParams()
      .set('state', status)
      .set('transId', transId)
    return this.http.get(this.apiUrl + 'api/wbheadvalidation/csupdatestatus?' + params, this.httpOptions).pipe(


    );
  }


}
