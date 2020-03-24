import { Injectable } from '@angular/core';
import * as securels from 'secure-ls';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

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
    console.log(this.ls.get('token'));
  }


  verifyCard(card, pin) {

    const params = new HttpParams()
      .set('cardnumber', card)
      .set('pin', pin)

    return this.http.get(this.apiUrl + 'api/wbcard/validate?' + params, this.httpOptions)
  }

  getInfoCardPerson(record) {

    const params = new HttpParams()
      .set('imageId', record)

    return this.http.get(this.apiUrl + 'api/wbimage/getImage?' + params, this.httpOptions)
  }

  verifyFingerCust(imageid, token) {

    const params = new HttpParams()
      .set('imageid', imageid)
      .set('token', token)

    return this.http.get('http://localhost:1111/api/wbservice/validatenasabah?' + params, this.httpOptions)
  }


  headTellerList(rls, brch) {

    const params = new HttpParams()
      .set('roles', rls)
      .set('branchcode', brch)

    return this.http.get(this.apiUrl + 'api/users/byroles?' + params, this.httpOptions)
  }


  verifyFingerHead(username, token) {

    const params = new HttpParams()
      .set('username', username)
      .set('token', token)

    return this.http.get('http://localhost:1111/api/wbservice/validatehead?' + params, this.httpOptions)
  }
}