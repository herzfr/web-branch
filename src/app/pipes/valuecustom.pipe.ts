import { Pipe, PipeTransform } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

@Pipe({
    name: 'valuecustom',
})
export class ValuecustomPipe implements PipeTransform {

    constructor(private config: ConfigurationService) {

    }

    transform(name: string): any {

        if (typeof (name) === 'string') {

            switch (name) {
                case this.config.getConfig().typeCheckSaldo:
                    return 'Cek Saldo';
                    break;
                case this.config.getConfig().typeSetorTunai:
                    return 'Setor Tunai';
                    break;
                case this.config.getConfig().typeTarikTunai:
                    return 'Tarik Tunai';
                    break;
                case this.config.getConfig().typeTransferAntarRek:
                    return 'Transfer Antar Rekening';
                    break;
                case this.config.getConfig().typeTransferAntarBank:
                    return 'Transfer Antar Bank';
                    break;
                case this.config.getConfig().typeNewAccount:
                    return 'New Account';
                    break;
                case this.config.getConfig().typeCheckSaldoGiro:
                    return 'Saldo Giro';
                    break;
                case this.config.getConfig().typeCheckSaldoTabungan:
                    return 'Saldo Tabungan';
                    break;
                case this.config.getConfig().typePayment:
                    return 'Transaksi Payment';
                    break;
                case "0":
                    return 'No';
                    break;
                case "1":
                    return 'Yes';
                    break;
                    break;
            }
        } else {
            switch (name) {
                case 0:
                    return 'No';
                    break;
                case 1:
                    return 'Yes';
                    break;
                default: break;
            }
        }

    }




}
