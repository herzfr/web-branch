import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  isVisibleSource: BehaviorSubject<boolean> = new BehaviorSubject(true);
  
  constructor() { }
}
