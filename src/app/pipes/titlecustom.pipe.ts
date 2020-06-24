import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecustom',
})
export class TitlecustomPipe implements PipeTransform {

  transform(name: string): any {

    switch (name) {
      case 'nm':
        return 'Amount';
        break;
      case 'tn':
        return 'Tunai';
        break;
      case 'tp':
        return 'Tipe Transaksi';
        break;
      case 'fr':
        return 'Rekening Asal';
        break;
      case 'to':
        return 'Rekening Tujuan';
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
      case 'cd':
        return 'Code';
        break;
      case 'ib':
        return 'ID Billing';
        break;
      case 'py':
        return 'Pembayaran';
        break;
      case 'sp':
        return '.';
        break;
      default:
        break;
    }
  }



}
