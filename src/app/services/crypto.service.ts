import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js/';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private keyPass: string = "someKeyPassPhraseForProtectXYZ431";

  constructor() { }

  encrypt(data: any) {
    return crypto.AES.encrypt(JSON.stringify(data), this.keyPass).toString();
  }

  decrypt(data: any) {
    return crypto.AES.decrypt(data, this.keyPass).toString(crypto.enc.Utf8);
  }

}


