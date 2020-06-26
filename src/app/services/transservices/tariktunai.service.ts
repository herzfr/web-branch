import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from 'src/app/models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class TariktunaiService {

  private apiUrl;
  private apiSocket;

  private ls = new SecureLS({ encodingType: 'aes' });
  private token = this.ls.get('token')

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };

  constructor(
    private http: HttpClient,
    private appConfiguration: AppConfiguration) {
    //config end point
    this.apiUrl = this.appConfiguration.ipServer;
    this.apiSocket = this.appConfiguration.ipSocketServer;
  }

  setorTunaiProses(body: any) {
    return this.http.post(this.apiUrl + 'api/comm/tariktunai', body, this.httpOptions)
  }


}
