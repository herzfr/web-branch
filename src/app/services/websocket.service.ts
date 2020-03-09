import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  // private serverUrl = 'https://192.168.137.1:8443/socket';
  private serverUrl = 'https://10.62.10.28:8444/socket';
  private stompClient;

  constructor(private dialog: DialogService) { }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {
      // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });

      that.stompClient.subscribe("/" + socket, (message) => {
        if (message.body) {
          return message.body;
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
