import { Component, OnInit, Inject, ViewChild, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper, MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import * as _moment from 'moment';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/services/AppDateAdapter ';
import { DataBranchServices } from 'src/app/services/data-branch.service';
import { Subscription } from 'rxjs';
const moment = _moment;


@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]

})
export class AddUserDialogComponent implements OnInit {

  message: string;
  message2: string;

  private isLinear: boolean = true;
  private firstFormGroup: FormGroup;
  private userDataForm: FormGroup;

  private isCompleted: boolean = false;
  private isFirstStepDone: boolean = true;
  private userNameControl: boolean = false;
  private userDataControl : boolean = false;
  private userProfileControl: boolean = false;

  private isUsed: boolean = false;
  private isUserNameDone: boolean = true;
 private  isUserDataDone : boolean = true;
  private isPasswordSame: boolean = true;
  private isFirstGroupValid : boolean = false;

  private subDataBranch: Subscription;
  private branchData: any;

  private roles: any = [{ role: "Admin", value: "admin" }, { role: "Teller", value: "teller" }, { role: "Customer Service", value: "cs" }];

  @ViewChild('stepper', {static : false}) stepper: MatStepper;



  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>, @Inject(MAT_DIALOG_DATA) data, private _formBuilder: FormBuilder,
    private userService: UserService, private dialog: MatDialog, private branchService: DataBranchServices
  ) {
    this.message = data.message;
    this.message2 = data.message2;
  }

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]],
      roles: ['', [Validators.required]],

    });
    this.userDataForm = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      branchCode: ['', [Validators.required]],
      email: ['', [Validators.email]],
      birthDay: ['', Validators.required],
      enabled: [],
    });

  }

  userNameCheck() {
    var userName = this.firstFormGroup.value.userName;
    console.log("value : ", userName);
    console.log("user same : ", this.isPasswordSame);
    

    if (this.firstFormGroup.valid && this.isPasswordSame) {
      this.userService.userNameCheck(this.firstFormGroup.value.userName).subscribe(res => {
        if (res['success']) {
          this.isUsed = false;
          this.userNameControl = true;
          this.isFirstGroupValid = true;
        } else if (!res['success']) {
          this.isUsed = true;
          this.userNameControl = false;
          this.isFirstGroupValid = false;
        }
      }, error => {
        this.userNameControl = false;
        this.openDialog("Error", "Check User Error");
      });
    } else {
      this.userNameControl = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  next(stepper: MatStepper) {
    console.log(this.firstFormGroup.value);
    this.isUserNameDone = false
    this.userNameControl = false;

    stepper.next();

    this.subDataBranch = this.branchService.getBranchAll().subscribe(res => {
      this.branchData = res;
    }, error => {
      this.openDialog("Error", "Error Get Branch Data");
    });

    setTimeout(() => {
      if (this.subDataBranch) {
        this.subDataBranch.unsubscribe()
      }
    }, 2000);
  }

  userDataFormNext(stepper: MatStepper) {
 
    // console.log("user data valid", this.userDataForm.valid);
    // console.log("user data value ", this.userDataForm.value);
    // console.log("username  valid", this.firstFormGroup.valid);
    // console.log("username data value ", this.firstFormGroup.value);

    if(this.userDataForm.valid && this.firstFormGroup.valid){
      this.userDataControl = true;
    
      this.isUserDataDone = false;
      console.log("valid OK");
      stepper.next();
      this.stepper.selectedIndex = 2; 
      
    }

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

  passwordChange() {
    console.log(this.firstFormGroup.value);
    let formData = this.firstFormGroup.value;
    console.log("password 1 : ", formData['password']);
    console.log("password 2 : ", formData['password2']);

    if (formData['password'] === formData['password2']) {
      console.log("sama ");
      this.isPasswordSame = true;
    } else {
      console.log("tidak sama ");
      this.isPasswordSame = false;
    }
  }

  move(index: number) {
    this.stepper.selectedIndex = index;
  } 

}
