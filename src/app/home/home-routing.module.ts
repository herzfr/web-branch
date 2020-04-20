import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserGuard } from '../services/guard/user.guard';
import { HeadTellerComponent } from '../head-teller/head-teller.component';
import { DashboardCsComponent } from '../dashboard-cs/dashboard-cs.component';

const routes: Routes = [
  {
    path: '',
    // component: DashboardComponent,
    // canActivate: [UserGuard]
  },
  {
    path: 'teller',
    component: DashboardComponent,
    // canActivate: [UserGuard]
  },
  {
    path: 'cs',
    component: DashboardCsComponent,
    // canActivate: [UserGuard]
  },
  {
    path: 'head-teller',
    component: HeadTellerComponent,
    // canActivate: [UserGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
