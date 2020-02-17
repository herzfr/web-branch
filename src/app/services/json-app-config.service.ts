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
        this.requestTimeout = data.requestTimeout;
        console.log("configuration loaded");
      })
      .catch(() => {
        alert('Could not load configuration');
      });
  }

}
