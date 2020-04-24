import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatIconRegistry } from '@angular/material';
import { HeadTellerDialogComponent } from '../dialog/head-teller-dialog/head-teller-dialog.component';
import { HeadService } from '../services/head.service';
import { OtoTable } from '../models/otorisastion-table';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as SecureLS from 'secure-ls';
import * as moment from 'moment';
import { AppConfiguration } from '../models/app.configuration';
import { UserDataService } from '../services/user-data.service';
import { Subscription } from 'rxjs';
import { RejectTransactionComponent } from '../dialog/reject-transaction/reject-transaction.component';
import { ConfirmTransactionComponent } from '../dialog/confirm-transaction/confirm-transaction.component';
import { DialogService } from '../services/dialog.service';
// import { DomSanitizer } from '@angular/platform-browser';
// created by Dwi & Herza

@Component({
  selector: 'app-head-teller',
  templateUrl: './head-teller.component.html',
  styleUrls: ['./head-teller.component.css'],

})
export class HeadTellerComponent implements OnInit, OnDestroy {

  private serverUrl;
  private stompClient;
  private socketDestination;

  private subDialog: Subscription;
  private subService: Subscription;
  private transId = null;

  displayedColumns = ['teller', 'transacId', 'time', 'term', 'detail'];
  OtoTableData: any;
  dataSource = new MatTableDataSource<OtoTable>(this.OtoTableData);
  userId: string;

  ls = new SecureLS({ encodingType: 'aes' });

  constructor(public dialog: MatDialog, private headServ: HeadService, private appConfig: AppConfiguration,
    private userData: UserDataService, private dialogService: DialogService) {
    let user = this.userData.getUserData();
    this.userId = user['userid'];
    this.serverUrl = appConfig.ipSocketServer + "socket";
  }

  ngOnInit() {
    this.getData()
    this.socketDestination = "vldspv" + this.userId;
    this.initializeWebSocketConnection(this.socketDestination);
  }

  ngOnDestroy(): void {
    this.disconectSocket();
    if (this.subDialog) {
      this.subDialog.unsubscribe();
    }
    if (this.subService) {
      this.subService.unsubscribe();
    }
  }


  getData() {
    this.headServ.getDataReqOtorisation(0, 60).subscribe(e => {
      // console.log(e);
      let arr = new Array;
      for (const key in e) {
        if (e.hasOwnProperty(key)) {
          const el = e[key];
          // console.log(el.timeStampValidation);
          var s = moment.utc(el.timeStampValidation).format("DD/MM/YYYY HH:mm:ss");
          el.timeStampValidation = moment.utc(el.timeStampValidation).format("DD/MM/YY HH:mm:ss")
          arr.push(el);
        }
      }
      this.dataSource = new MatTableDataSource<OtoTable>(arr);
    })

  }

  MainFunction(event, num: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: parseInt(num),
      message: JSON.parse(event['transbuff']),
    }
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';

    switch (num) {
      case '1':
        console.log('detail');
        this.dialog.open(HeadTellerDialogComponent, dialogConfig)
        break;
      case '2':
        this.rejectTrans(event['transbuff']);
        this.transId = event['transid'];
        break;
      case '3':
        console.log('confirm');
        this.confirmTrans(event['transbuff']);
        this.transId = event['transid'];
        break;
      default:
        break;
    }
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {

      that.stompClient.subscribe("/" + socket, (message) => {
        if (message.body) {
          const dataBody = JSON.parse(message.body);
          if (dataBody.newRecord) {
            that.getData();
          }
        }
      }, () => {
        that.dialogService.errorDialog("Error", "Koneksi Terputus, Koneksi Ulang");
        setTimeout(() => {
          that.initializeWebSocketConnection(that.socketDestination);
        }, 2000);

      });
    }, err => {
      that.dialogService.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }

  disconectSocket() {
    this.stompClient.disconnect();
  }

  rejectTrans(value) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      id: 1,
      value: value
    };
    this.subDialog = this.dialog.open(RejectTransactionComponent, dialogConfig).afterClosed().subscribe(resBack => {
      if (resBack['isRejected']) {
        this.confirmRejected();
      }
    });
  }

  confirmTrans(value) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      id: 1,
      value: value
    };
    this.subDialog = this.dialog.open(ConfirmTransactionComponent, dialogConfig).afterClosed().subscribe(resBack => {
      console.log("return value : ", resBack['returnType']);

      let valueReturn = resBack['returnType'];
      if (valueReturn === 2) {
        // console.log("approve");
        this.subService = this.headServ.setState(1, this.transId, 0, this.userId).subscribe(res => {
          this.getData();
        })

      } else if (valueReturn === 3) {
        // console.log("rejected ");
        this.confirmRejected();
      }

    });
  }

  confirmRejected() {
    this.subService = this.headServ.setState(1, this.transId, 1, this.userId).subscribe(res => {
      this.getData();
    });
  }

}

export interface PeriodicElement {
  tellerName: string;
  time: string;
  termId: string;
}
