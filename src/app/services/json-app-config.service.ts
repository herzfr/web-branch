import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class JsonAppConfigService extends AppConfiguration {

  constructor(private http: HttpClient) {
    super();
  }

  //fungsi promise 
  load() {
    return this.http.get<AppConfiguration>('./assets/config/app.config.json')
      .toPromise()
      .then(data => {
        this.ipAs = data.ipAs;
        this.ipServer = data.ipServer;
        this.ipSocketServer = data.ipSocketServer;
        this.requestTimeout = data.requestTimeout;
        this.ipLocalHost = "http://localhost:1111/api/wbservice/"
        this.ipLocalHostSocket = "http://localhost:1111/socket"
        console.log("configuration loaded");
      })
      .catch(() => {
        alert('Could not load configuration');
      });
  }

}
