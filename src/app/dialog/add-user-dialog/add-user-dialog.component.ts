import { Component, OnInit, Inject, ViewChild, AfterViewInit, OnDestroy, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper, MatDialog, MatDialogConfig, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import * as _moment from 'moment';
import * as securels from 'secure-ls';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/services/AppDateAdapter ';
import { DataBranchServices } from 'src/app/services/data-branch.service';
import { Subscription, iif } from 'rxjs';
import { AnimationOptions } from 'ngx-lottie';
const moment = _moment;

// created by Dwi S

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]

})
export class AddUserDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  private btnCancel = "Batal";

  private isLinear: boolean = true;
  private isPassMatch: boolean = true;

  private step1Editable: boolean = true;
  private step2Editable: boolean = false;

  private step1Completed: boolean = false;
  private step2Completed: boolean = false;

  private isUsed: boolean = false;
  private isUserNameReadOnly: boolean = false;
  private isNextStep2: boolean = false;

  private userNameModel: any = {};
  private userDataModel: any = {};
  private userNameOption: any = { standalone: true };


  private userNameInputIcon: any = "done";
  private isShowUserNameInputIcon: boolean = false;
  private isSuccess: boolean = false;

  private subDataBranch: Subscription;
  private subUserService: Subscription;
  private branchData: any;

  private secureLs = new securels({ encodingType: 'aes' });
  private logedUser: any;

  private roles: any = [{ role: "Admin", value: "admin" }, { role: "Teller", value: "teller" }, { role: "Customer Service", value: "cs" }];

  private options: AnimationOptions = {
    path: '/assets/lottie/successicon.json'
  };

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild('UserNameForm', { static: false }) UserNameForm: NgForm;

  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>, private userService: UserService,
    private dialog: MatDialog, private branchService: DataBranchServices
  ) {
    this.logedUser = JSON.parse(this.secureLs.get('data')).username;
  }

  ngOnDestroy(): void {
    if (this.subDataBranch) {
      this.subDataBranch.unsubscribe();
    }
    if (this.subUserService) {
      this.subUserService.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
  }

  userNameCheck() {
    if (this.isPassMatch) {
      this.subUserService = this.userService.userNameCheck(this.userNameModel.userName).subscribe(res => {
        if (res['success']) {
          this.isUsed = false;
          this.step1Completed = true;
          this.step1Editable = false;
          this.isNextStep2 = true;
          this.isUserNameReadOnly = true;
          this.isShowUserNameInputIcon = true;
          this.userNameInputIcon = "done";
        } else if (!res['success']) {
          this.isUsed = true;
          this.step1Completed = false;
          this.step1Editable = true;
          this.isShowUserNameInputIcon = false;
          this.userNameInputIcon = "clear";
        }
      }, error => {
        this.step1Completed = false;
        this.openDialog("Error", "Check User Error");
      });
    }
    setTimeout(() => {
      this.subUserService.unsubscribe();
    }, 1000);
  }

  nextStep2() {
    this.step2Completed = false;
    this.step2Editable = true;
    setTimeout(() => {
      this.next(1);
    }, 100);

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

  nextStep3() {
    this.step2Completed = true;
    this.step2Editable = false;
    setTimeout(() => {
      this.next(2);
    }, 100);
  }

  close() {
    this.dialogRef.close({"reload": true});
    // return { "reload": true };
  }

  next(index: number) {
    this.stepper.selectedIndex = index;
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

  onPassInput() {
    if (this.userNameModel.password === this.userNameModel.password2) {
      this.isPassMatch = true;
    } else {
      this.isPassMatch = false;
    }
  }

  saveUser() {
    const userNameData = this.userNameModel;
    const userData = this.userDataModel;
    let User: any = {};

    for (const key in userNameData) {
      if (userNameData.hasOwnProperty(key)) {
        const element = userNameData[key];
        let modelKey = key.toLowerCase();
        if (key === 'role') {
          User['roles'] = [element];
        } else {
          User[modelKey] = element;
        }
      }
    }

    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        const element = userData[key];
        let modelKey = key.toLowerCase();

        if (key === "enabled") {
          if (element) {
            User[modelKey] = 1;
          } else {
            User[modelKey] = 0;
          }
        } else {
          User[modelKey] = element;
        }

      }
    }
    User.birthday = moment(User.birthday).format("DD-MM-YYYY");
    User.userterminal = this.pad("TRM" + User.username.toUpperCase(), 10).substring(0, 10);
    User.imageid = this.randomPad("IMG" + User.username.toUpperCase(), 32).substring(0, 32);
    User.userid = this.randomPad("USER" + User.username.substring(0, 5).toUpperCase(), 30);
    User.creationby = this.logedUser;
    delete User.password2;

    this.subUserService = this.userService.addUser(User).subscribe((res) => {
      this.isSuccess = true;
      this.btnCancel = "Tutup";
    }, error => {
      this.openDialog("Error", "Gagal Membuat User Baru");
    });


  }

  pad(value: string, size: number): string {
    let s = value + "";
    while (s.length < size) s = s + "0";
    return s;
  }

  randomPad(number, length) {
    var str = '' + number;
    while (str.length < length) {
      str = str + Math.floor(Math.random() * 9);
    }
    return str;
  }

}
