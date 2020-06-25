import { Pipe, PipeTransform } from '@angular/core';
import { TransactionService } from '../services/transaction.service';

@Pipe({
    name: 'paymentcustom',
})

export class PaymentCustomPipe implements PipeTransform {

    private menuPayment: any;
    private subMenuPay: any = [];

    constructor(private transactionService: TransactionService) {
        this.transactionService.getDataPayment().subscribe(res => {
            console.log(res);
            this.menuPayment = res
        })
    }

    getPaymentMenu(code) {
        // return this.menuPayment.filter(x => x.code === code);
        let data = this.menuPayment.find(x => x.code === code);
        console.log(data.name);
        return data.name;
    }

    getPaymentSubMenu(code) {
        let data = this.menuPayment.find(x => x.code === code);
        console.log(data.name);
        return data.name;
    }

    transform(value: any, arg1): any {
        console.log(value);
        console.log(arg1);


        // return this.getPaymentMenu(arg1)


    }

    // transform(code: string): any {
    //     // console.log(name.length);
    //     // console.log(this.menuPayment);
    //     console.log(this.getDimensionsByFilter(code));
    //     return this.getDimensionsByFilter(code)
    // }

}