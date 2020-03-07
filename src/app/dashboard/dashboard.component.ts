import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NavItem } from '../models/nav-item';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DialogService } from '../services/dialog.service';
import { WebsocketService } from '../services/websocket.service';
import * as moment from 'moment';
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
    let dataQ;

    let branch = JSON.parse(localStorage.getItem('terminal'))
    let branchCode = branch.branchCode;

    this.queueServ.getDataQue(branchCode, this.waitingStatusX).subscribe(res => {
      // console.log(res);
      let data = new Array;
      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          const element = res[key];
          let transBf = JSON.parse(element.transbuff);
          let date = moment(element.timestampentry).format('DD/MM/YYYY HH:mm:ss')
          // let transf = new Array;
          // this.DataTableQ.push(element)

          // console.log(element);  


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

          element.transbuff = JSON.stringify(transBf);
          element.timestampentry = date;

          data.push(element)
        }
      }



      var _data = [];
      _data.push(data[0]);

      for (var i = 1; i < data.length; i++) {
        var alreadyExistsAt = this.existsAt(_data, 'queueno', data[i].queueno);
        // console.log(alreadyExistsAt);
        if (alreadyExistsAt !== false) {
          _data[alreadyExistsAt].transbuff += ', ' + data[i].transbuff;
        } else {
          _data.push(data[i]);
          console.log(data[i]);
          dataQ = data[i];


        }
      }

      // console.log(_data);



      for (const key in _data) {
        if (_data.hasOwnProperty(key)) {
          const element = _data[key];
          console.log(element.transbuff);
          _data[key].transbuff = "[" + element.transbuff + "]";
          let parse = JSON.parse(_data[key].transbuff)
          _data[key].transbuff = parse;
        }
      }


      console.log(_data);
      this.DataTableQ = _data;
      this.dataSource = new MatTableDataSource<QTable>(this.DataTableQ);

    })

    setTimeout(() => {
      // console.log(this.DataTableQ);
      let dataQ: any = this.DataTableQ;


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


  private serverUrl = 'https://192.168.137.1:8444/socket';

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
            that.getDataTableQ();
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




export interface dataQueueNo {
  branchcode: string;
  queuecode: string;
  queuedate: string;
  queueno: string;
  timestampentry: string;
  trntype: any[];

}
