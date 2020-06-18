import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { TellerTransactionComponent } from './teller-transaction/teller-transaction.component';


@NgModule({
  declarations: [TellerTransactionComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  entryComponents: []
})
export class DashboardModule { }
