import { Injectable } from '@angular/core';
import { AppConfiguration } from '../models/app.configuration';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataBranchServices {


  private apiUrl: string = '';

  constructor(private appConfiguration: AppConfiguration, private http: HttpClient) {
    this.apiUrl = this.appConfiguration.ipServer;
  }


  getBranchAll() {
    return this.http.get(this.apiUrl + 'api/wbbrch')
  }

  getTerminalId(branch) {
    return this.http.get(this.apiUrl + 'api/wbterm/bybranch?branchCode=' + branch)
  }

  getIp() {
    return this.http.get(this.apiUrl + 'api/utility/getip')
  }
}
