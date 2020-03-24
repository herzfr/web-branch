import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';
import * as securels from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl;

  private ls = new securels({ encodingType: 'aes' });
  private token = this.ls.get('token')

  private headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.token);

  private httpOptions = {
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
    return this.http.get(this.apiUrl + 'api/users/check?user=' + userName, this.httpOptions);
  }

  deleteUser(value) {
    var userId = value.userid;
    return this.http.delete(this.apiUrl + 'api/users?userId=' + userId, this.httpOptions)
  }

  addUser(user: any) {
    return this.http.post(this.apiUrl + 'api/users/', user, this.httpOptions);
  }

  changePass(user: any) {
    return this.http.post(this.apiUrl + 'api/users/changepass', user, this.httpOptions)
  }

  editUser(user: any) {
    return this.http.put(this.apiUrl + 'api/users', user, this.httpOptions)
  }

  getUserRoles(): any {
    let user = JSON.parse(this.ls.get('data'));
    let rolesData: any = {};
    rolesData.isAdmin = user.roles.includes("admin")
    rolesData.isHeadTeller = user.roles.includes("headteller")
    rolesData.isHeadCs = user.roles.includes("headcs")
    rolesData.isTeller = user.roles.includes("teller")
    rolesData.isCs = user.roles.includes("cs")
    return rolesData;
  }


}
