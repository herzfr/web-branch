import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavItem } from '../models/nav-item';
import { MatPaginator, MatTableDataSource } from '@angular/material';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ['queue', 'time', 'type'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() {

  }


  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nextQueue() {
    $('#transaction-queue').modal('show')
  }

}



export interface PeriodicElement {
  queue: string;
  time: string;
  type: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { queue: '01', time: ' 09:45:32', type: 'STR' },
  { queue: '02', time: ' 09:45:32', type: 'TTN' },
  { queue: '03', time: ' 09:45:32', type: 'TRX' },
  { queue: '04', time: ' 09:45:32', type: 'TRX' },
  { queue: '06', time: ' 09:45:32', type: 'STR' },
  { queue: '07', time: ' 09:45:32', type: 'TTN' },
  { queue: '08', time: ' 09:45:32', type: 'TRX' },
  { queue: '09', time: ' 09:45:32', type: 'TTN' },
];
