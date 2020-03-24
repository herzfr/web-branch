import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MaterialModule } from '../material.modul';
import { HeadTellerComponent } from '../head-teller/head-teller.component';
// import { DialogTransactionComponent } from '../dialog/dialog-transaction/dialog-transaction.component';


@NgModule({
  declarations: [DashboardComponent, HeadTellerComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule
  ]
})
export class HomeModule { }
