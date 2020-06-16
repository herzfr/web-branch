import { Injectable } from '@angular/core';

import * as securels from 'secure-ls';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';


@Injectable({
  providedIn: 'root'
})
export class UserTerminalService {

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

  getAllUserTerminal() {
    return this.http.get(this.apiUrl + 'api/wbtermuser/', this.httpOptions);
  }


}
