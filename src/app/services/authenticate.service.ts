import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { catchError, timeout, } from 'rxjs/operators';
import { of } from 'rxjs';
import * as securels from 'secure-ls';
import { AppConfiguration } from '../models/app.configuration';
import { LoginModel } from '../models/login-model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private apiUrl: string;
  private timeOut: number;
  private localHost: string = "http://localhost:1111/";
  private ls = new securels({ encodingType: 'aes' });

  constructor(private AppConfiguration: AppConfiguration, private http: HttpClient) {
    this.apiUrl = this.AppConfiguration.ipServer;
    this.timeOut = this.AppConfiguration.requestTimeout;
  }
  authenticate(data: LoginModel) {
    const authenticateObj = JSON.stringify(data);
    return this.http.post(this.apiUrl + "authenticate", authenticateObj, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    }).pipe(
      timeout(this.timeOut),
      catchError(e => {
        if (e.name === "TimeoutError") {
          // this.showNotification("error", e.message)
        } else if (e.name === "HttpErrorResponse") {
          if (e.status == 401) {
            // this.showNotification("error", e.error.message);
          } else {
            // this.showNotification("error", e.message);
          }
        }
        return of(e);
      })
    )
  }

  openLoginApp() {
    return this.http.get(this.localHost + "openApp");
  }

  callLoginApp() {
    return this.http.get(this.localHost + "call");
  }

}
