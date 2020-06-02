import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecustom',
})
export class TitlecustomPipe implements PipeTransform {

  transform(name: string): any {

    switch (name) {
      case 'nm':
        return 'Nominal';
        break;
      case 'tn':
        return 'Tunai';
        break;
      case 'tp':
        return 'Tipe Transaksi';
        break;
      case 'fr':
        return 'Dari Rek.';
        break;
      case 'to':
        return 'Ke Rek';
        break;
      case 'br':
        return 'Berita';
        break;
      case 'bc':
        return 'Kode Bank';
        break;
      case 'id':
        return 'ID KTP/Paspor';
        break;
      default:
        break;
    }
  }

 


}
