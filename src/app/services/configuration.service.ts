import { Injectable } from '@angular/core';
import { configuration } from '../config/configuration';

// created by Dwi S & Herza
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private config: any = configuration;
  getConfig() {
    return this.config;
  }
}
