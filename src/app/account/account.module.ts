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
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeUserDialogComponent } from '../dialog/change-user-dialog/change-user-dialog.component';
import { UserBiometricComponent } from '../dialog/user-biometric/user-biometric.component';
import { SignaturePadModule } from '@ng-plus/signature-pad';

@NgModule({
  declarations: [
    AccountComponent,
    AddUserDialogComponent,
    DeleteUserDialogComponent,
    ChangeUserDialogComponent,
    UserBiometricComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SignaturePadModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
  ],
  entryComponents: [AddUserDialogComponent, DeleteUserDialogComponent, ChangeUserDialogComponent, UserBiometricComponent],
  providers: [UserService, {
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AccountModule { }
export function playerFactory() {
  return import('lottie-web');
}