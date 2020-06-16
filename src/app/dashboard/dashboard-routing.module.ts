import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TellerTransactionComponent } from './teller-transaction/teller-transaction.component';


const routes: Routes = [
  { path: 'transaction-channel', component: TellerTransactionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
