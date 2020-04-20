import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NasabahService {

  private apiUrl
  private apiSocket = 'http://localhost:1111/';


  // http://localhost:1111/api/wbservice/newNasabahBiometric

  constructor(private http: HttpClient) { }

  callNasabahVerify() {
    return this.http.get(this.apiSocket + 'api/wbservice/newNasabahBiometric')
  }
}
