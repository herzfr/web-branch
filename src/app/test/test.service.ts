import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl;

  ls = new SecureLS({ encodingType: 'aes' });
  token = this.ls.get('token')

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };

  constructor(private appConfiguration: AppConfiguration, private http: HttpClient) {
    this.apiUrl = this.appConfiguration.ipServer;
  }

  testSending(value: string) {
    const params = new HttpParams()
      .set('encoded', value)

    console.log(params);

    return this.http.post("http://localhost:1111/testing?" + params, "{\"open\" : true }")


  }
}
