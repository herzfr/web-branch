import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AnimationOptions } from 'ngx-lottie';
import { TransactionService } from 'src/app/services/transaction.service'
import { UserDataService } from 'src/app/services/user-data.service'
import { Subscription } from 'rxjs';
import { AppConfiguration } from 'src/app/models/app.configuration';
import * as SecureLS from 'secure-ls';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { DialogService } from 'src/app/services/dialog.service';

declare var $: any;

@Component({
  selector: 'app-confirm-transaction',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.css']
})
export class ConfirmTransactionComponent implements OnInit, AfterViewInit {

  private serverUrl: string;
  private stompClient;

  ls = new SecureLS({ encodingType: 'aes' });

  private value: any;
  private returnValue: any = {};
  private isFingerSuccess: boolean = false;
  private userName: string;
  private userToken: string;

  private subVerify: Subscription;

  private options: AnimationOptions = {
    path: '/assets/lottie/fingerprint.json'
  };

  constructor(private dialogRef: MatDialogRef<ConfirmTransactionComponent>, @Inject(MAT_DIALOG_DATA) data, private dialog: DialogService,
    private transactionService: TransactionService, private userDataService: UserDataService, private appConfig: AppConfiguration) {
    this.value = data.value;

    this.serverUrl = this.appConfig.ipLocalHostSocket;

    console.log("server url : ", this.appConfig.ipLocalHostSocket);

  }
  ngAfterViewInit(): void {
    this.callFingerService();
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.userName = this.userDataService.getUserData().username;
    this.userToken = this.userDataService.getUserToken();
  }

  close() {
    this.returnValue.returnType = 1;
    this.dialogRef.close(this.returnValue);
  }

  approve() {
    this.returnValue.returnType = 2;
    this.dialogRef.close(this.returnValue);
  }

  reject() {
    this.returnValue.returnType = 3;
    this.dialogRef.close(this.returnValue);
  }

  callFingerService() {

    this.subVerify = this.transactionService.callApp().subscribe(res => {
      let value = res;
      if (value['success']) {
        this.callHeadValidation();
      }
    });
  }

  callHeadValidation() {
    this.subVerify = this.transactionService.verifyFingerHead(this.userName, this.userToken).subscribe(res => {
      let value = res;
      if (value['success']) {

        this.initializeWebSocketConnection("vldspv")
        setTimeout(() => {
          this.subVerify.unsubscribe();
        }, 1000);
      }
    });
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {

      that.stompClient.subscribe("/" + socket, (message) => {

        if (message.body) {
          const body = JSON.parse(message.body);
          if (body.success) {
            that.isFingerSuccess = true;
          }
        }

      }, () => {
        that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }





}
