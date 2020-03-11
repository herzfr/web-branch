import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private apiUrl;
  private apiSocket;

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
  // .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };


  constructor(private appConfiguration: AppConfiguration, private http: HttpClient) {
    this.apiUrl = this.appConfiguration.ipServer;
    this.apiSocket = this.appConfiguration.ipSocketServer;
  }

  getNewQueue(brch: string, status1: string, status2) {
    const params = new HttpParams()
      .set('branchcode', brch)
      .set('status1', status1)
      .set('status2', status2);
    return this.http.get(this.apiUrl + 'api/queue/newqueue?' + params, this.httpOptions)

  }

  getDataQueByNo(brch: string, stus: number, que: number) {
    let body = "?branchcode=" + brch + "&status=" + stus + "&queueno=" + que;

    // console.log(body);
    return this.http.get(this.apiUrl + 'api/queue/getbyno' + body, this.httpOptions)
      .pipe(

      )
  }

  getLatestQue(brch: string, stus: number) {
    let body = "?status=" + stus + "&branchcode=" + brch;
    return this.http.get(this.apiUrl + 'api/queue/latestqueue' + body, this.httpOptions)
  }

  changeStatusTransactionQ(body) {
    return this.http.post(this.apiUrl + 'api/queue/updateStatus', body, this.httpOptions)
  }

  refreshQ(brch) {
    return this.http.get(this.apiSocket + 'api/queue/refresh?branchcode=' + brch, this.httpOptions)
  }
}
