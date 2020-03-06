import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavItem } from '../models/nav-item';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { DialogTransactionComponent } from '../dialog/dialog-transaction/dialog-transaction.component';
import { WebsocketService } from '../services/websocket.service';
declare var $: any;
declare var jQuery: any;



import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { QueueService } from '../services/queue.service';
import { QTable } from '../models/queue-table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  waitingStatusX: string = '999';
  waitingStatusY: string = '000';

  DataTableQ: QTable[];
  // ELEMENT_DATA: QTable[];

  displayedColumns = ['queue', 'time', 'type'];
  dataSource = new MatTableDataSource<QTable>(this.DataTableQ);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dialog: DialogService, public dlg: MatDialog, private websocket: WebsocketService, private queueServ: QueueService) {

  }


  ngOnInit() {
    this.getDataTableQ();
    this.dataSource.paginator = this.paginator;
    this.connect();
  }

  getDataTableQ() {

    console.log('jalan');

    let branch = JSON.parse(localStorage.getItem('terminal'))
    let branchCode = branch.branchCode;

    this.queueServ.getDataQue(branchCode, this.waitingStatusX).subscribe(res => {
      console.log(res);
      let data = new Array;
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const element = res[key];
          let transBf = JSON.parse(element.transbuff);
          // this.DataTableQ.push(element)
          switch (transBf.tp) {
            case 'trk':
              transBf.tp = 'Tarik Tunai';
              break;
            case 'str':
              transBf.tp = 'Setor Tunai';
              break;
            case 'tar':
              transBf.tp = 'Transfer Antar Rekening';
              break;
            case 'tab':
              transBf.tp = 'Transfer Antar Bank';
              break;
            default:
              break;
          }

          element.transbuff = transBf;
          console.log(element);
          data.push(element)
        }
      }

      var _data = [];
      _data.push(data[0]);



      for (var i = 1; i < data.length; i++) {
        var alreadyExistsAt = this.existsAt(_data, 'queueno', data[i].queueno);
        if (alreadyExistsAt !== false) {
          _data[alreadyExistsAt].writer += ', ' + data[i].writer;
        } else {
          _data.push(data[i]);
        }
      }

      console.log(_data);

      this.DataTableQ = _data;
      this.dataSource = new MatTableDataSource<QTable>(this.DataTableQ);

    })

    setTimeout(() => {
      console.log(this.DataTableQ);
    }, 1000)
  }

  existsAt(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return i;
      }
    }
    return false;
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
    // const branchWord = converter.toWords(branchCode).split("-").join("");
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
