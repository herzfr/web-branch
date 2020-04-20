import { Component, OnInit, Inject } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import * as securels from 'secure-ls';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-reject-transaction',
  templateUrl: './reject-transaction.component.html',
  styleUrls: ['./reject-transaction.component.css']
})
export class RejectTransactionComponent implements OnInit {

  private serverUrl = 'https://10.62.10.28:8444/socket'
  private stompClient;

  private value: any;
  private returnValue: any = {};

  private options: AnimationOptions = {
    path: '/assets/lottie/delete.json'
  };

  constructor(private dialogRef: MatDialogRef<RejectTransactionComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.value = data.value;
    console.log("sendinng value : ", this.value);

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
  }

  private animationCreated(): void {
  }

  close() {
    this.returnValue.isRejected = false;
    this.dialogRef.close(this.returnValue);
  }

  rejected() {
    this.returnValue.isRejected = true;
    this.dialogRef.close(this.returnValue);
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {

      that.stompClient.subscribe("/" + socket, (message) => {

        if (message.body) {
          const body = JSON.parse(message.body);


          console.log("isi Body :", body);


        }

      }, () => {
        // that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }




}
