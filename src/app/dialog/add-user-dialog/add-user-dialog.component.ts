import { Component, OnInit, Inject, ViewChild,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  message: string;
  message2: string;

  private isLinear: boolean = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  isCompleted: boolean = false;
  isFirstStepDone : boolean = true;
  userNameControl: boolean = false;

  @ViewChild('stepper', {static : false}) private myStepper: MatStepper;


constructor(private dialogRef: MatDialogRef < AddUserDialogComponent >, @Inject(MAT_DIALOG_DATA) data, private _formBuilder: FormBuilder) {
  this.message = data.message;
  this.message2 = data.message2;
}

ngOnInit() {

  this.firstFormGroup = this._formBuilder.group({
    userName: ['', Validators.required]
  });
  this.secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required]
  });





}




close() {
  this.dialogRef.close();
}

}
