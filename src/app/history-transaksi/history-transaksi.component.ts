import { Component, OnInit, ViewChild } from '@angular/core';
// Material Module
import { QTable } from '../models/queue-table';
import { MatPaginator } from '@angular/material';
// Universal Module
import * as moment from 'moment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as SecureLS from 'secure-ls';
// Import JQUERY
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-history-transaksi',
  templateUrl: './history-transaksi.component.html',
  styleUrls: ['./history-transaksi.component.css']
})
export class HistoryTransaksiComponent implements OnInit {

  // DataTableQ: QTable[];
  branchCode;
  ELEMENT_DATA: QTable[];
  isQEmpty: boolean = false;

  private serverUrl;
  private stompClient;

  displayedColumns = ['queue', 'time', 'type', 'transid', 'approver', 'approve'];
  // dataSource = new MatTableDataSource<QTable>(this.DataTableQ);

  secureLs = new SecureLS({ encodingType: 'aes' });

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
  }

}
