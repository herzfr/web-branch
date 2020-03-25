import { Component, OnInit, Inject } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-reject-transaction',
  templateUrl: './reject-transaction.component.html',
  styleUrls: ['./reject-transaction.component.css']
})
export class RejectTransactionComponent implements OnInit {

  private value: any;
  private returnValue: any = {};

  private options: AnimationOptions = {
    path: '/assets/lottie/delete.json'
  };

  constructor(private dialogRef: MatDialogRef<RejectTransactionComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.value = data.value;
    console.log("sendinng value : ", this.value);

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  private animationCreated(): void {
  }

  close() {
    this.returnValue.isRejected = false;
    this.dialogRef.close(this.returnValue);
  }

  rejected() {
    this.returnValue.isRejected = true;
    this.dialogRef.close(this.returnValue);
  }

}
