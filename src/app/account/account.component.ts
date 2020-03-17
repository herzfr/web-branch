import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig, MatSidenav } from '@angular/material';
import { UserData } from '../models/UserData';
import { merge, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { AddUserDialogComponent } from '../dialog/add-user-dialog/add-user-dialog.component';
import { DeleteUserDialogComponent } from '../dialog/delete-user-dialog/delete-user-dialog.component';
import { DialogErrorComponent } from '../dialog/dialog-error/dialog-error.component';
import { ChangeUserDialogComponent } from '../dialog/change-user-dialog/change-user-dialog.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataBranchServices } from '../services/data-branch.service';
import * as moment from 'moment';

// created by Dwi S

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {

  private displayedColumns: string[] = ['username', 'branchcode', 'firstname', 'lastname', "action"];
  private dataSource = new MatTableDataSource<UserData>();

  private pageIndex: number;
  private pageSize: number;
  private length: number;
  private searchValue: string;

  private subUserService: Subscription;
  private subDialog: Subscription;
  private subUserDelete: Subscription;

  private passwordModel: any = {};
  private userNameOption: any = { standalone: true };
  private isPassMatch: boolean = true;

  private formPassword: FormGroup;
  private formEditUser: FormGroup;
  private userIDChange: string;
  private dataAllBrch: any;
  // private sidenav: MatSidenav;
  // dates = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  private roles: any = [
    { role: "Admin", value: "admin" },
    { role: "Teller", value: "teller" },
    { role: "Customer Service", value: "cs" },
    { role: "Head Teller", value: "headteller" },
    { role: "Head CS", value: "headcs" },
  ];

  favoriteSeason: string = 'Winter';

  seasons = [
    1,
    0,
  ];

  @ViewChild('sidenavEdit', { static: true }) sidenavEdit: MatSidenav;
  @ViewChild('sidenavChange', { static: true }) sidenavChange: MatSidenav;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private usersService: UserService, private dialog: MatDialog, private dataBrch: DataBranchServices) {
    this.formPassword = new FormGroup({
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required)
    })

    this.formEditUser = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      birthday: new FormControl((new Date()).toISOString(), Validators.required),
      email: new FormControl(null, Validators.required),
      branchcode: new FormControl(null, Validators.required),
      roles: new FormControl(null, Validators.required),
      enabledF: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.getAllUsersData("", 5, 0);
    this.dataSource.paginator = this.paginator;
  }

  getAllUsersData(search: string, size, page) {
    var userSearch = "";
    if (search.length < 1) {
      userSearch = "";
    } else {
      userSearch = search;
    }
    this.usersService.getAllUsers(search, size, page).subscribe((data) => {
      this.pageSize = data['pageable'].pageSize;
      this.pageIndex = data['pageable'].pageNumber;
      this.length = data['totalElements'];
      this.dataSource = data['content'];
    }, error => {
      this.errorDialog("Error", "Gagal Mendapatkan Data Tabel User");
    });
  }

  ngAfterViewInit() {

  }

  getServerData(event) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.getAllUsersData("", pageSize, pageIndex);
  }

  ngOnDestroy(): void {
    if (this.subUserService) {
      this.subUserService.unsubscribe();
    }
    if (this.subDialog) {
      this.subDialog.unsubscribe();
    }
  }

  userSearch(event) {
    this.getAllUsersData(this.searchValue, 5, 0);
  }

  addUser() {
    console.log("run add user ");
    const dialogConfig = new MatDialogConfig();

    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      id: 1,
      message: "test",
      message2: "message2"
    };

    this.subDialog = this.dialog.open(AddUserDialogComponent, dialogConfig).afterClosed().subscribe(resBack => {
      console.log(resBack);
      if (resBack.reload) {
        this.getAllUsersData("", 5, 0);
      }
    });
  }


  deleteUser(value) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      id: 1,
      value: value
    };
    this.subDialog = this.dialog.open(DeleteUserDialogComponent, dialogConfig).afterClosed().subscribe(resBack => {
      console.log(resBack.delete);
      if (resBack.delete) {
        this.confirmDelete(resBack)
      }
    });
  }

  confirmDelete(value) {
    // var pageIndex = this.paginator.pageIndex;
    var pageSize = this.paginator.pageSize;
    this.subUserDelete = this.usersService.deleteUser(value).subscribe(res => {
      console.log("back ", res);

      if (res['success']) {
        this.getAllUsersData("", pageSize, 0);
      } else {
        this.getAllUsersData("", pageSize, 0);
        this.errorDialog("Error", "Gagal Menghapus User");
      }
    }, error => {
      this.errorDialog("Error", "Gagal Menghapus User, Kesalahan Jaringan")
    })

  }

  onPassInput() {
    if (this.formPassword.value.password === this.formPassword.value.password2) {
      this.isPassMatch = true;
    } else {
      this.isPassMatch = false;
    }
  }


  errorDialog(message, message2) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      message: message,
      message2: message2
    };
    this.dialog.open(DialogErrorComponent, dialogConfig);
  }

  getIdUser(event) {
    this.userIDChange = event.userid;
  }

  openSideNav(event: string) {
    switch (event) {
      case 'edit':
        this.sidenavEdit.open();
        this.dataBrch.getBranchAll().subscribe(e => {
          console.log(e);
          this.dataAllBrch = e;
        })
        break;
      case 'change':
        this.sidenavChange.open();
        break;
      default:
        break;
    }



  }

  close(event) {
    switch (event) {
      case 'edit':
        this.sidenavEdit.close();
        break;
      case 'change':
        this.sidenavChange.close();
        break;
      default:
        break;
    }
  }

  changePass() {
    if (this.formPassword.valid && this.isPassMatch == true) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        id: 1,
        message: 'Klik "YA" jika anda sudah yakin dengan pembaruan password anda',
        buttonConfirm: true
      };
      dialogConfig.backdropClass = 'backdropBackground';
      this.dialog.open(ChangeUserDialogComponent, dialogConfig).afterClosed().subscribe(res => {
        console.log(res);
        if (res) {
          let obj: any = new Object();
          obj.password = this.formPassword.value.password;
          obj.userId = this.userIDChange;
          console.log(obj);
          // this.sidenav.close()

          this.usersService.changePass(obj).subscribe(e => {
            console.log(e);
            if (e['success']) {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                id: 1,
                message: 'Password anda telah diganti',
                buttonSuccess: true
              };
              dialogConfig.backdropClass = 'backdropBackground';
              this.dialog.open(ChangeUserDialogComponent, dialogConfig).afterClosed().subscribe(res => {
                // console.log(res);
                if (res === 'exit') {
                  this.sidenavChange.close()
                  this.formPassword.reset()
                }
              })
            }
          })
        } else {
          console.log('password Batal');
        }
      })
    } else {
      alert('password belum valid')
    }
  }

  getUserEdit(event) {
    console.log(event['birthday']);
    // var dateValidate = moment(event['birthday']).isValid() || moment(event['birthday'], "DD/MM/YYYY").isValid() ? true : false;
    const date = moment(event['birthday'], 'DD-MM-YYYY').toISOString();
    console.log(date);



    this.formEditUser = new FormGroup({
      firstname: new FormControl(event['firstname'], Validators.required),
      lastname: new FormControl(event['lastname'], Validators.required),
      birthday: new FormControl(date, Validators.required),
      email: new FormControl(event['email'], Validators.required),
      branchcode: new FormControl(event['branchcode'], Validators.required),
      roles: new FormControl(event['roles'], Validators.required),
      enabledF: new FormControl([event['enabled']], Validators.required),
    });

    console.log(this.formEditUser);

  }

  saveEdit() {
    console.log(this.formEditUser.value);

  }

}


