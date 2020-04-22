import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialog-success',
  templateUrl: './dialog-success.component.html',
  styleUrls: ['./dialog-success.component.css']
})
export class DialogSuccessComponent implements OnInit {

  private dataInfo: any

  constructor(private dialogRef: MatDialogRef<DialogSuccessComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog) {
    // console.log(data.data);
    this.dataInfo = data.data;
  }

  ngOnInit() {
  }

  ok() {
    this.dialogRef.close(true)
  }

}
