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

  getAllUsers(search, size, page) {
    const params = new HttpParams()
      .set('search', search)
      .set('size', size)
      .set('page', page);
    return this.http.get(this.apiUrl + 'api/users?' + params, this.httpOptions)
  }
}
