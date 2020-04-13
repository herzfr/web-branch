import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialog-transaction-non',
  templateUrl: './dialog-transaction-non.component.html',
  styleUrls: ['./dialog-transaction-non.component.css', './dialog-transaction-non.component.scss']
})
export class DialogTransactionNonComponent implements OnInit {

  private data: any;

  constructor(private dialogRef: MatDialogRef<DialogTransactionNonComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog) {
    this.data = data.data;
  }

  ngOnInit() {
  }

}
