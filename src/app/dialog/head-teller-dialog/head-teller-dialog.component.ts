import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-head-teller-dialog',
  templateUrl: './head-teller-dialog.component.html',
  styleUrls: ['./head-teller-dialog.component.css']
})
export class HeadTellerDialogComponent implements OnInit {

  private data;
  private id: number;

  constructor(private dialogRef: MatDialogRef<HeadTellerDialogComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog,
  ) {
    this.id = data.id
    this.data = data.message;
    console.log("data : ", this.data);

  }

  ngOnInit() {
  }

  closeInfo() {
    this.dialogRef.close()
  }




}
