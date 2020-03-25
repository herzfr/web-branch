import { Injectable } from '@angular/core';
import * as securels from 'secure-ls';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private ls = new securels({ encodingType: 'aes' });

  constructor() { }

  getUserData() {
    const data = JSON.parse(this.ls.get("data"));
    return data;
  }

}
