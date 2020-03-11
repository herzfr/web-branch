import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UserData } from '../models/UserData';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, Subscription } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {


  displayedColumns: string[] = ['username', 'branchcode', 'firstname', 'lastname', "action"];
  dataSource = new MatTableDataSource<UserData>();


  pageIndex: number;
  pageSize: number;
  length: number;
  searchValue: string;

  subUserService: Subscription;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private usersService: UserService, private _httpClient: HttpClient) {
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
  }

  userSearch(event) {
    console.log(event);
    console.log(this.searchValue);

    console.log(this.paginator);

    this.getAllUsersData(this.searchValue, 5, 0);



  }

}


