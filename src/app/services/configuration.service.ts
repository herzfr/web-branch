import { Injectable } from '@angular/core';

import { transactioncode } from '../config/transactioncode';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private config: any = transactioncode;
  getConfig() {
    return this.config;
  }
}
