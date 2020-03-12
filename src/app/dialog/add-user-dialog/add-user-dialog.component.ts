import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  message: string;
  message2: string;

  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.message = data.message;
    this.message2 = data.message2;
   }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
