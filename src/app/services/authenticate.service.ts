import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {


  apiUrl: string = 'http://localhost:8080';
  // apiAs: string = '';
  timeOut: number = 10000;

  private token: any = "";

  headers_object = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Content-Type', 'undefined')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', 'POST')
    .set('Access-Control-Allow-Methods', 'GET')
    .set('Access-Control-Allow-Headers', 'Origin')
    .set('Access-Control-Allow-Credentials', 'true')
  // .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };

  constructor(private http: HttpClient) { }

  asAuth(username: string, password: string) {


    return this.http.get(this.apiUrl + '/api/authenticate?username=' + username + '&password=' + password, this.httpOptions)
      .pipe(
        timeout(this.timeOut),
        catchError(e => {
          console.log(e);



          return of(e)
        })
      )

  }

  // showConfirm(title: string, errorMsg: string, typeModal: string) {
  //   let disposable = this.dialogService.addDialog(ModalComponent, {
  //     title: title,
  //     message: errorMsg,
  //     type: typeModal
  //   }, { backdropColor: 'rgba(90,90,90,0.5)' })
  //     .subscribe((isConfirmed) => {
  //     });
  // }


}
