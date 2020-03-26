import { Component, OnInit, Inject } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-user-biometric',
  templateUrl: './user-biometric.component.html',
  styleUrls: ['./user-biometric.component.css']
})
export class UserBiometricComponent implements OnInit {

  private value: any;
  private returnValue: any = {};


  constructor(private dialogRef: MatDialogRef<UserBiometricComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.value = data.value;
    console.log("sending value : ", this.value);

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  close() {
    this.returnValue.isRejected = false;
    this.dialogRef.close(this.returnValue);
  }

}
