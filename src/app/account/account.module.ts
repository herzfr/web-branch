import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { MaterialModule } from '../material.modul';
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserDialogComponent } from '../dialog/add-user-dialog/add-user-dialog.component';
import { DeleteUserDialogComponent } from '../dialog/delete-user-dialog/delete-user-dialog.component';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  declarations: [
    AccountComponent,
    AddUserDialogComponent,
    DeleteUserDialogComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
  ],
  entryComponents: [AddUserDialogComponent, DeleteUserDialogComponent],
  providers: [UserService]
})
export class AccountModule { }
export function playerFactory() {
  return import('lottie-web');
}