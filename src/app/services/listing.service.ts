import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor() { }

  getListing(data) {

    // console.log(data);

    switch (data.tp) {
      case 'Setor Tunai':
        let group = {
          tp: data.tp,
          id: data.id,
          fr: data.fr,
          nm: data.nm,
          tn: data.tn,
        };
        return group;
      default: break;
    }
  }
}
