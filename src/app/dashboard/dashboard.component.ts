import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavItem } from '../models/nav-item';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { DialogTransactionComponent } from '../dialog/dialog-transaction/dialog-transaction.component';
import { WebsocketService } from '../services/websocket.service';
declare var $: any;
declare var jQuery: any;

import converter from 'number-to-words';


import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns = ['queue', 'time', 'type'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: DialogService, public dlg: MatDialog, private websocket: WebsocketService) {

  }


  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.connect();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  nextQueue() {
    this.dialog.transactionDialog("Test", "uhuy")
  }

  connect() {

    let ls = JSON.parse(localStorage.getItem("terminal"));
    const branchCode = ls.branchCode;
    const branchWord = converter.toWords(branchCode).split("-").join("");
    const socketChannel = "/tlrx" + branchCode;

    console.log(socketChannel);
    // this.websocket.initializeWebSocketConnection(socketChannel);
    // console.log("branch code ", branchCode.replace(/^0+/, ''));
    // console.log(a.split("-").join(""));

    this.initializeWebSocketConnection(socketChannel);
  }


  private serverUrl = 'https://10.62.10.28:8444/socket';

  private stompClient;



  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {
      // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });

      that.stompClient.subscribe(socket, (message) => {
        if (message.body) {
          console.log(JSON.parse(message.body));

          if (JSON.parse(message.body).success) {
            console.log("Success bro");
          }
        }
      }, () => {
        that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }

  disconnect() {
    this.stompClient.disconnect();
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
