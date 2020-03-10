import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl;

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')

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
