import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { OtoTable } from '../models/otorisastion-table';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import * as SecureLS from 'secure-ls';
import * as moment from 'moment';
import { HeadService } from '../services/head.service';
import { AppConfiguration } from '../models/app.configuration';
import { UserDataService } from '../services/user-data.service';
import { DialogService } from '../services/dialog.service';
import { ConfirmTransactionComponent } from '../dialog/confirm-transaction/confirm-transaction.component';
import { HeadTellerDialogComponent } from '../dialog/head-teller-dialog/head-teller-dialog.component';
import { RejectTransactionComponent } from '../dialog/reject-transaction/reject-transaction.component';
import { HeadCsDialogComponent } from '../dialog/head-cs-dialog/head-cs-dialog.component';
import { HeadConfirmComponent } from '../dialog/head-confirm/head-confirm.component';
import { QueueService } from '../services/queue.service';

@Component({
  selector: 'app-head-cs',
  templateUrl: './head-cs.component.html',
  styleUrls: ['./head-cs.component.css']
})
export class HeadCsComponent implements OnInit {

  private serverUrl;
  private stompClient;
  private socketDestination;

  private subDialog: Subscription;
  private subService: Subscription;
  private transId = null;
  private detailHeadCS: any;
  private formData: any;

  displayedColumns = ['teller', 'transacId', 'time', 'term', 'detail'];
  OtoTableData: any;
  dataSource = new MatTableDataSource<OtoTable>(this.OtoTableData);
  userId: string;

  ls = new SecureLS({ encodingType: 'aes' });

  constructor(public dialog: MatDialog, private headServ: HeadService, private appConfig: AppConfiguration,
    private userData: UserDataService, private dialogService: DialogService, private queueService: QueueService) {
    let user = this.userData.getUserData();
    this.detailHeadCS = this.userData.getUserData();
    this.userId = user['userid'];
    this.serverUrl = appConfig.ipSocketServer + "socket";

    console.log(this.detailHeadCS);
  }

  ngOnInit() {
    this.getData()
    this.socketDestination = "vldspv" + this.userId;
    this.initializeWebSocketConnection(this.socketDestination);
  }


  ngOnDestroy(): void {
    // this.disconectSocket();
    // if (this.subDialog) {
    //   this.subDialog.unsubscribe();
    // }
    // if (this.subService) {
    //   this.subService.unsubscribe();
    // }
  }


  getData() {
    this.headServ.getDataReqOtoHeadCS(this.detailHeadCS['username'], this.detailHeadCS['branchcode'], "999").subscribe(e => {
      let arr = new Array;
      for (const key in e) {
        if (e.hasOwnProperty(key)) {
          const el = e[key];
          // console.log(el);
          var s = moment.utc(el.timeStampValidation).format("DD/MM/YYYY HH:mm:ss");
          el.timeStampValidation = moment.utc(el.timeStampValidation).format("DD/MM/YY HH:mm:ss")
          arr.push(el);
        }
      }
      // console.log(arr);
      this.dataSource = new MatTableDataSource<OtoTable>(arr);
    });

  }

  MainFunction(event, num: string) {
    this.formData = event;
    console.log("event value : ", event);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: parseInt(num),
      message: JSON.parse(event['transbuff']),
    }
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '1200px';

    switch (num) {
      case '1':
        console.log('detail');
        this.dialog.open(HeadCsDialogComponent, dialogConfig)
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
    this.subDialog = this.dialog.open(HeadConfirmComponent, dialogConfig).afterClosed().subscribe(resBack => {
      let valueReturn = resBack['returnType'];
      if (valueReturn === 2) {

        this.subService = this.headServ.setState(1, this.transId, 0, this.userId).subscribe(res => {
          if (res['success']) {
            this.subService = this.headServ.updateValidation("000", this.transId).subscribe(res => {
              if (res['success']) {

                const dataProsesApi = {
                  "transid": this.transId,
                  "branchcode": this.formData.branchcode,
                  "terminalid": this.formData.terminalid,
                  "queuedate": this.formData.queuedate,
                  "queuecode": this.formData.queuecode,
                  "queueno": this.formData.queueno.toString(),
                  "timestampentry": this.formData.timestampentry.toString(),
                  "userid": this.formData.userid,
                  "userterminal": this.formData.userterminal,
                  "trntype": this.formData.trntype,
                  "status": "000",
                  "transbuff": this.formData.transbuff,
                  "username": JSON.parse(this.ls.get('data')).username,
                  "id": this.formData.username,
                  "isCash": this.formData.isCash,
                  "transcnt": this.formData.transcnt,
                  "transeq": this.formData.transeq,
                  "iscustomer": this.formData.iscustomer
                }

                console.log(dataProsesApi);

                this.queueService.processTransactionDataQ(dataProsesApi).subscribe(res => {
                  console.log(res);
                  if (res['success']) {
                    this.getData();
                  }
                });

                

              }
            });
          }
        });

      } else if (valueReturn === 3) {
        console.log("rejected ");
        this.confirmRejected();
      }

    });
  }

  confirmRejected() {
    this.subService = this.headServ.setState(1, this.transId, 1, this.userId).subscribe(res => {
      if (res['success']) {
        this.getData();
      }
    });
  }

}

export interface PeriodicElement {
  tellerName: string;
  time: string;
  termId: string;
}
