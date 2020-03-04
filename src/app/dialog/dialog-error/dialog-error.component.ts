import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
  styleUrls: ['./dialog-error.component.css']
})
export class DialogErrorComponent implements OnInit {

  message: string;
  message2: string;

  private options: AnimationOptions = {
    path: '/assets/lottie/erroricon.json'
  };


  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DialogErrorComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.message = data.message;
    this.message2 = data.message2;
  }

  private animationCreated(): void {
    // console.log(animationItem);
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }
}
