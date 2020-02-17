import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { catchError, timeout, } from 'rxjs/operators';
import { of } from 'rxjs';
import * as securels from 'secure-ls';
import { NotifierService } from 'angular-notifier';
import { AppConfiguration } from '../models/app.configuration';
import { LoginModel } from '../models/login-model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {


  private apiUrl: string = '';
  private timeOut: number = 10000;

  constructor(private AppConfiguration: AppConfiguration, private http : HttpClient) {
    this.apiUrl = this.AppConfiguration.ipServer;
    this.timeOut = this.AppConfiguration.requestTimeout;
  }

  // headers_object = new HttpHeaders()
  //   .set('Content-Type', 'application/json')
  // // .set('Authorization', 'Bearer ' + this.token);

  // httpOptions = {
  //   headers: this.headers_object
  // };

  // ls = new securels({ encodingType: 'aes' });

  // constructor(private http: HttpClient, private notifier: NotifierService, private handler: HttpBackend) { }

  // asAuth(username, password) {
  //   return this.http.post<any>(this.apiUrl + '/authenticate', { username, password }).pipe(
  //     timeout(this.timeOut),
  //     catchError(e => {
  //       console.log(e);
  //       if (e.name === "TimeoutError") {
  //         this.showNotification("error", e.message)
  //       } else if (e.name === "HttpErrorResponse") {
  //         if (e.status == 401) {
  //           this.showNotification("error", e.error.message);
  //         } else {
  //           this.showNotification("error", e.message);
  //         }
  //       }
  //       return of(e);
  //     })
  //   );
  // }



  // authenticate(username, password) {

  //   return this.http.post(this.apiUrl + '/authenticate', { username, password }, {
  //     headers: new HttpHeaders()
  //       .set('Content-Type', 'application/json')
  //   }).pipe(
  //     timeout(this.timeOut),
  //     catchError(e => {
  //       console.log("error " ,e);

  //       if (e.name === "TimeoutError") {
  //         this.showNotification("error", e.message)
  //       } else if (e.name === "HttpErrorResponse") {
  //         if (e.status == 401) {
  //           this.showNotification("error", e.error.message);
  //         } else {
  //           console.log("status 500");
  //           alert("error ");
  //           this.showNotification("error", e.message);
  //         }
  //       }
  //       return of(e);
  //     })
  //   )
  // }


  // public showNotification(type: string, message: string): void {
  //   this.notifier.notify(type, message);
  // }

  authenticate(data: LoginModel){

    const authenticateObj = JSON.stringify(data);

    return this.http.post( this.apiUrl + "authenticate", authenticateObj, {
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

}
