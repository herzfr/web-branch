import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private apiUrl = 'https://10.62.10.23:8443'


  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
  // .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };


  constructor(private http: HttpClient) { }

  getDataQue(brch: string, stus: number) {

    let body = "?branchcode=" + brch + "&status=" + stus;

    // console.log(body);
    return this.http.get(this.apiUrl + '/api/queue/getqueue' + body, this.httpOptions)
      .pipe(

      )
  }
}
