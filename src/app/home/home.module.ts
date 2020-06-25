import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MaterialModule } from '../material.modul';
import { HeadTellerComponent } from '../head-teller/head-teller.component';
import { RejectTransactionComponent } from '../dialog/reject-transaction/reject-transaction.component';
import { LottieModule } from 'ngx-lottie';
import { ConfirmTransactionComponent } from '../dialog/confirm-transaction/confirm-transaction.component';
import { DashboardCsComponent } from '../dashboard-cs/dashboard-cs.component';
import { HeadCsComponent } from '../head-cs/head-cs.component';
import { HistoryTransaksiComponent } from '../history-transaksi/history-transaksi.component';
import { FotonasabahComponent } from '../dialog/fotonasabah/fotonasabah.component';
import { NasabahsignComponent } from '../dialog/nasabahsign/nasabahsign.component';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { SetortunaiService } from '../services/transservices/setortunai.service';
import { TransferonusService } from '../services/transservices/transferonus.service';


@NgModule({
  declarations: [DashboardComponent,
    HeadTellerComponent,
    RejectTransactionComponent,
    ConfirmTransactionComponent,
    DashboardCsComponent,
    HeadCsComponent,
    HistoryTransaksiComponent,
    NasabahsignComponent,
    FotonasabahComponent
  ],
  entryComponents: [RejectTransactionComponent, ConfirmTransactionComponent, FotonasabahComponent, NasabahsignComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
    SignaturePadModule
  ],
  providers: [SetortunaiService, TransferonusService
  ]
})
export class HomeModule { }
export function playerFactory() {
  return import('lottie-web');
}