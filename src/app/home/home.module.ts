import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MaterialModule } from '../material.modul';
import { HeadTellerComponent } from '../head-teller/head-teller.component';
import { RejectTransactionComponent } from '../dialog/reject-transaction/reject-transaction.component';
import { LottieModule } from 'ngx-lottie';
import { ConfirmTransactionComponent } from '../dialog/confirm-transaction/confirm-transaction.component';


@NgModule({
  declarations: [DashboardComponent, HeadTellerComponent, RejectTransactionComponent, ConfirmTransactionComponent],
  entryComponents: [RejectTransactionComponent, ConfirmTransactionComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
  ]
})
export class HomeModule { }
export function playerFactory() {
  return import('lottie-web');
}