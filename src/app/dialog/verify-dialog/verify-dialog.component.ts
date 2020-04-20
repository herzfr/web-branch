import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-verify-dialog',
  templateUrl: './verify-dialog.component.html',
  styleUrls: ['./verify-dialog.component.css']
})
export class VerifyDialogComponent implements OnInit {

  private serverUrl = 'http://localhost:1111/socket'
  private stompClient;


  private dataForm0;
  private dataForm1;
  private dataForm3;
  private dataForm4;


  constructor(private dialogRef: MatDialogRef<VerifyDialogComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog) {
    console.log(data.data);

  }

  ngOnInit() {
    this.initializeWebSocketConnection('nasabahbiometric')
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
            that.stompClient.disconnect();
            that.dialogRef.close('reload')
            // console.log(body.token);
          }
        }

      }, () => {
        // that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }
}
