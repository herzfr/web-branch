import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-change-user-dialog',
  templateUrl: './change-user-dialog.component.html',
  styleUrls: ['./change-user-dialog.component.css']
})
export class ChangeUserDialogComponent implements OnInit {

  private message;
  private btnSuccess = false;
  private btnConfirm = false;

  constructor(private dialogRef: MatDialogRef<ChangeUserDialogComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog) {
    this.message = data.message;
    this.btnConfirm = data.buttonConfirm;
    this.btnSuccess = data.buttonSuccess;
    console.log(data);

  }

  ngOnInit() {
  }

  onNoClick(event) {
    // console.log(event);
    this.dialogRef.close(event)
    this.message = ''
  }

}
