import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'titlecustom2',
})
export class Titlecustom2Pipe implements PipeTransform {

    transform(name: string) {
        switch (name) {
            case 'wsnomn':
                return 'Nominal';
                break;
            case 'wsicas':
                return 'Tunai';
                break;
            case 'wstype':
                return 'Tipe Transaksi';
                break;
            case 'wsfrom':
                return 'Rekening Asal';
                break;
            case 'wstoto':
                return 'Rekening Tujuan';
                break;
            case 'wsbrta':
                return 'Berita';
                break;
            case 'wsbcod':
                return 'Kode Bank';
                break;
            case 'wsidid':
                return 'ID KTP/Paspor';
                break;
            case 'wsicas':
                return 'Cash ?';
                break;
            case 'wstran':
                return 'Transaksi ID';
                break;
            case 'wstonm':
                return 'Pemilik Rekening Tujuan';
                break;
            case 'wsfrnm':
                return 'Pemilik Rekening Asal';
                break;
            case 'wspaym':
                return 'Pembayaran';
                break;
            case 'wsspym':
                return 'Detail';
                break;
            case 'wsbilid':
                return 'Bill ID';
                break;
            default:
                break;
        }
    }

}
