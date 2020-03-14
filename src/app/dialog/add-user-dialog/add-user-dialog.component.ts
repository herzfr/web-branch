import { Component, OnInit, Inject, ViewChild, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper, MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  message: string;
  message2: string;

  private isLinear: boolean = true;
  private firstFormGroup: FormGroup;
  private secondFormGroup: FormGroup;

  private isCompleted: boolean = false;
  private isFirstStepDone: boolean = true;
  private userNameControl: boolean = false;
  private userNameValidation: boolean = true;
  private errorMessage: string = "";
  private isUsed: boolean = false;


  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;


  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private _formBuilder: FormBuilder, private userService: UserService,
    private dialog: MatDialog
  ) {
    this.message = data.message;
    this.message2 = data.message2;
  }

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

  }

  userNameCheck() {
    console.log(this.firstFormGroup);


    var userName = this.firstFormGroup.value.userName;

    if (this.firstFormGroup.valid) {
      this.userNameValidation = true;


      this.userService.userNameCheck(this.firstFormGroup.value.userName).subscribe(res => {
        console.log(res);

        if (res['success']) {
          console.log();

          this.isUsed = false;
          this.userNameValidation = false;
          console.log("is Used : ", this.isUsed);
        } else if (!res['success']) {
          console.log("sudah terpakai");

          this.errorMessage = "username sudah terpakai";

          // this.firstFormGroup.controls.userName.setErrors({"Error"});
          this.isUsed = true;
          this.userNameValidation = true;
          console.log("is Used : ", this.isUsed);
          console.log("test : ", this.isUsed);


        }

      }, error => {
        this.openDialog("Error", "Check User Error");
      });

    } else {

      this.userNameValidation = false;

      console.log("kosong");

    }




  }



  close() {
    this.dialogRef.close();
  }



  openDialog(message, message2) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      message: message,
      message2: message2
    };
    this.dialog.open(DialogErrorComponent, dialogConfig);
  }

}
