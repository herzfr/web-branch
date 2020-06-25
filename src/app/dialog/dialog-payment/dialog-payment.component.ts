import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-payment',
  templateUrl: './dialog-payment.component.html',
  styleUrls: ['./dialog-payment.component.css']
})
export class DialogPaymentComponent implements OnInit {

  private dataInfo: any;

  constructor(private dialogRef: MatDialogRef<DialogPaymentComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog) {
    this.dataInfo = data;
  }

  ngOnInit() {
  }

  onProcess(event) {
    this.dialogRef.close(event)
  }

}
