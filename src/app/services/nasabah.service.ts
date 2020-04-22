import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NasabahService {

  // http://localhost:1111/api/wbservice/newNasabahBiometric
  private apiUrl = 'http://localhost:1111/'

  constructor(private http: HttpClient) { }


  callRegisterBiometric() {
    return this.http.get(this.apiUrl + 'api/wbservice/newNasabahBiometric')
  }
}
