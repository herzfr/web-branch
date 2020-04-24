import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';
import * as securels from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class NasabahService {

  // http://localhost:1111/api/wbservice/newNasabahBiometric
  private apiUrlLocal = 'http://localhost:1111/'
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
    // console.log(this.ls.get('token'))
  }


  callRegisterBiometric() {
    return this.http.get(this.apiUrlLocal + 'api/wbservice/newNasabahBiometric')
  }

  accValidationNewAccount(username, body) {
    return this.http.post(this.apiUrl + 'api/wbheadvalidation/newAccValidation?username=' + username, body, this.httpOptions)
  }

  headCSList(rls, brch) {
    const params = new HttpParams()
      .set('roles', rls)
      .set('branchcode', brch)
    return this.http.get(this.apiUrl + 'api/users/byroles?' + params, this.httpOptions)
  }

  verifyFingerHead(username, token) {
    const params = new HttpParams()
      .set('username', username)
      .set('token', token)
    return this.http.get(this.apiUrlLocal + 'api/wbservice/validatehead?' + params, this.httpOptions)
  }

  // https://10.62.10.28:8443/api/wbheadvalidation/newAccValidation
  callApp() {
    return this.http.get(this.apiUrlLocal + "api/wbservice/call");
  }
}
