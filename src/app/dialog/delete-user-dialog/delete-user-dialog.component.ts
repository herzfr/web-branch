import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, yearsPerPage } from '@angular/material';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.css']
})
export class DeleteUserDialogComponent implements OnInit, OnDestroy {

  value: any;

  private options: AnimationOptions = {
    path: '/assets/lottie/delete.json'
  };


  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private dialog: MatDialog) {
    this.value = data.value;
  }
  ngOnDestroy(): void {
    
  }

  ngOnInit() {
  }

  private animationCreated(): void {
    // console.log(animationItem);
  }

  close(event) {
    this.value.delete = false;
    this.dialogRef.close(this.value);
    console.log(this.value);
  }

  delete() {
    this.value.delete = true;
    this.dialogRef.close(this.value);
  }


}
