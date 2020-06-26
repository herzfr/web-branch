import { Pipe, PipeTransform } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';

@Pipe({
    name: 'valuecustom',
})
export class ValuecustomPipe implements PipeTransform {

    typeCheckSaldoGiro = "0001001";
    typeCheckSaldoTabungan = "0002001";
    typeSetorTunai = "0000001";
    typeTransferAntarRek = "0000002";
    typeTransferAntarBank = "0000003";
    typeTarikTunai = "0000004";
    typeInfoSaldo = "0000005";
    typePayment = "0000006";
    typeNewAccount = "0000007";

    typeCheckSaldoGiro2 = "9001001";
    typeCheckSaldoTabungan2 = "9002001";
    typeSetorTunai2 = "9000001";
    typeTransferAntarRek2 = "9000002";
    typeTransferAntarBank2 = "9000003";
    typeTarikTunai2 = "9000004";
    typeInfoSaldo2 = "9000005";
    typePayment2 = "9000006";
    typeNewAccount2 = "9000007";


    constructor(private config: ConfigurationService) {
        // this.typeSetorTunai = this.config.getConfig().typeSetorTunai;
        // this.typeTarikTunai = this.config.getConfig().typeTarikTunai;
        // this.typeTransferAntarRek = this.config.getConfig().typeTransferAntarRek;
        // this.typeTransferAntarBank = this.config.getConfig().typeTransferAntarBank;
        // this.typeNewAccount = this.config.getConfig().typeNewAccount;
        // this.typeCheckSaldoGiro = this.config.getConfig().typeCheckSaldoGiro;
        // this.typeCheckSaldoTabungan = this.config.getConfig().typeCheckSaldoTabungan;
        // this.typePayment = this.config.getConfig().typePayment;
        // this.typeSetorTunai2 = this.subChanges(this.typeSetorTunai)
        // this.typeTarikTunai2 = this.subChanges(this.typeTarikTunai)
        // this.typeTransferAntarRek2 = this.subChanges(this.typeTransferAntarRek)
        // this.typeTransferAntarBank2 = this.subChanges(this.typeTransferAntarBank)
        // this.typeNewAccount2 = this.subChanges(this.typeNewAccount)
        // this.typeCheckSaldoGiro2 = this.subChanges(this.typeCheckSaldoGiro)
        // this.typeCheckSaldoTabungan2 = this.subChanges(this.typeCheckSaldoTabungan)
        // this.typePayment2 = this.subChanges(this.typePayment)


        // console.log(this.typeSetorTunai);
        // console.log(this.typeTarikTunai);
        // console.log(this.typeTransferAntarRek);
        // console.log(this.typeTransferAntarBank);
        // console.log(this.typeNewAccount);
        // console.log(this.typeCheckSaldoGiro);
        // console.log(this.typeCheckSaldoTabungan);
        // console.log(this.typePayment);
        // console.log(this.typeSetorTunai2);
        // console.log(this.typeTarikTunai2);
        // console.log(this.typeTransferAntarRek2);
        // console.log(this.typeTransferAntarBank2);
        // console.log(this.typeNewAccount2);
        // console.log(this.typeCheckSaldoGiro2);
        // console.log(this.typeCheckSaldoTabungan2);
        // console.log(this.typePayment2);


    }

    transform(name: string): any {

        if (typeof (name) === 'string') {

            switch (name) {
                case this.typeSetorTunai:
                    return 'Setor Tunai';
                    break;
                case this.typeTarikTunai:
                    return 'Tarik Tunai';
                    break;
                case this.typeTransferAntarRek:
                    return 'Over Booking';
                    break;
                case this.typeTransferAntarBank:
                    return 'Transfer';
                    break;
                case this.typeNewAccount:
                    return 'New Account';
                    break;
                case this.typeCheckSaldoGiro:
                    return 'Saldo Giro';
                    break;
                case this.typeCheckSaldoTabungan:
                    return 'Saldo Tabungan';
                    break;
                case this.typePayment:
                    return 'Payment';
                    break;
                case this.typeSetorTunai2:
                    return 'Setor Tunai';
                    break;
                case this.typeTarikTunai2:
                    return 'Tarik Tunai';
                    break;
                case this.typeTransferAntarRek2:
                    return 'Over Booking';
                    break;
                case this.typeTransferAntarBank2:
                    return 'Transfer';
                    break;
                case this.typeNewAccount2:
                    return 'New Account';
                    break;
                case this.typeCheckSaldoGiro2:
                    return 'Saldo Giro';
                    break;
                case this.typeCheckSaldoTabungan2:
                    return 'Saldo Tabungan';
                    break;
                case this.typePayment2:
                    return 'Payment';
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

    subChanges(event) {
        return event.replace(event.substr(0, 1), "9")
    }


}
