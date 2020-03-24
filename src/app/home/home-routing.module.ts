import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserGuard } from '../services/guard/user.guard';

const routes: Routes = [
  {
    path: '',
    // component: DashboardComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'teller',
    component: DashboardComponent,
    // canActivate: [UserGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
