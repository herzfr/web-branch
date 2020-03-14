import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig } from '@angular/material';
import { UserData } from '../models/UserData';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { AddUserDialogComponent } from '../dialog/add-user-dialog/add-user-dialog.component';
import { DeleteUserDialogComponent } from '../dialog/delete-user-dialog/delete-user-dialog.component';


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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private usersService: UserService, private dialog: MatDialog) {

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
    console.log(event);
    console.log(this.searchValue);

    console.log(this.paginator);

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


    });

  }


  deleteUser(value) {

    var pageIndex = this.paginator.pageIndex;
    var pageSize = this.paginator.pageSize;

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
    var pageIndex = this.paginator.pageIndex;
    var pageSize = this.paginator.pageSize;

    this.subUserDelete = this.usersService.deleteUser(value).subscribe(res => {
      console.log(res);

      if (res['success']) {
        this.getAllUsersData("", pageSize, 0);
      } else {
        this.getAllUsersData("", pageSize, 0);
      }
    })

  }

}


