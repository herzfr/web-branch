import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient, HttpBackend } from '@angular/common/http';
import { catchError, timeout, map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as securels from 'secure-ls';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {


  apiUrl: string = 'https://10.62.10.23:8443';
  timeOut: number = 10000;

  private authenticated = false;
  private token: any = "";

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
  // .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };

  ls = new securels({ encodingType: 'aes' });

  constructor(private http: HttpClient, private notifier: NotifierService, private handler: HttpBackend) { }

  asAuth(username, password) {
    return this.http.post<any>(this.apiUrl + '/authenticate', { username, password }).pipe(
      timeout(this.timeOut),
      catchError(e => {
        console.log(e);


        if (e.name === "TimeoutError") {
          this.showNotification("error", e.message)
        } else if (e.name === "HttpErrorResponse") {
          if (e.status == 401) {
            this.showNotification("error", e.error.message);
          } else {
            this.showNotification("error", e.message);
          }
        }
        return of(e);
      })
    );
  }


  public showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

}
