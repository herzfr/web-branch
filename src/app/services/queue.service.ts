import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private apiUrl = 'https://10.62.10.28:8443'


  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
  // .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };


  constructor(private http: HttpClient) { }

  getDataQue(brch: string, stus: string) {

    const params = new HttpParams()
      .set('branchcode', brch)
      .set('status', stus);

    // let body = "?branchcode=" + brch + "&status=" + stus;

    return this.http.get(this.apiUrl + '/api/queue/getqueue?' + params, this.httpOptions)
    
  }

  getDataQueByNo(brch: string, stus: number, que: number) {

    let body = "?branchcode=" + brch + "&status=" + stus + "&queueno=" + que;

    // console.log(body);
    return this.http.get(this.apiUrl + '/api/queue/getbyno' + body, this.httpOptions)
      .pipe(

      )
  }
}
