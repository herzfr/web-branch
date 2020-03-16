import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';
import * as securels from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl;

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
  }

  getAllUsers(search, size, page) {
    const params = new HttpParams()
      .set('search', search)
      .set('size', size)
      .set('page', page);
    return this.http.get(this.apiUrl + 'api/users?' + params, this.httpOptions)
  }

  userNameCheck(userName: string) {
    return this.http.get(this.apiUrl + 'api/users/check?user=' + userName);
  }

  deleteUser(value) {
    var userId = value.userid;
    return this.http.delete(this.apiUrl + 'api/users?userId=' + userId)
  }

  addUser(user: any) {
    return this.http.post(this.apiUrl + 'api/users/', user, this.httpOptions);
  }

  changePass(user: any) {
    return this.http.post(this.apiUrl + 'api/users/changepass', user, this.httpOptions)
  }


}
