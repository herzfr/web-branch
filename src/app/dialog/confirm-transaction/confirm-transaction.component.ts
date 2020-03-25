import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-confirm-transaction',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.css']
})
export class ConfirmTransactionComponent implements OnInit {
 
  private value: any;
  private returnValue: any = {};

  private options: AnimationOptions = {
    path: '/assets/lottie/question.json'
  };

  constructor(private dialogRef: MatDialogRef<ConfirmTransactionComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.value = data.value;
    console.log("sending value : ", this.value);

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  private animationCreated(): void {
  }

  close() {
    this.returnValue.isApprove = false;
    this.dialogRef.close(this.returnValue);
  }

  approve() {
    this.returnValue.isApprove = true;
    this.dialogRef.close(this.returnValue);
  }

}
