import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { MaterialModule } from '../material.modul';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { AddUserDialogComponent } from '../dialog/add-user-dialog/add-user-dialog.component';

@NgModule({
  declarations: [
    AccountComponent,
    AddUserDialogComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    FormsModule
  ],
  entryComponents: [AddUserDialogComponent],
  providers: [UserService]
})
export class AccountModule { }
