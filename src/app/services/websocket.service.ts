import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { DialogService } from './dialog.service';
import { AppConfiguration } from '../models/app.configuration';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private serverUrl;
  private serverLocal = 'http://localhost:1111/socket';
  private stompClient;

  constructor(private dialog: DialogService, private appConfig: AppConfiguration) {
    this.serverUrl = appConfig.ipSocketServer + "socket";
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {

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

  initSocketHeadTellerConnection(time, code, id): Promise<any> {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    let proms = new Promise((res, rej) => {
      this.stompClient.connect({}, function (frame) {
        // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });
        that.stompClient.subscribe("/" + code + id, (message) => {
          if (message.body) {
            let receivedValue = JSON.parse(message.body);
            console.log(receivedValue);
            res(message.body)
          }
        }, () => {
          rej("Data Error")
          return alert("koneksi terputus");
        });
      }, err => {
        rej("Data Error")
        return alert("gagal menghubungkan ke server");
      });
    });
    return proms;
  }


  initSocketHeadTellerConnectionOver(code): any {
    let ws = new SockJS(this.serverLocal);
    this.stompClient = Stomp.over(ws);
    let that = this;

    let proms = new Promise((res, rej) => {
      this.stompClient.connect({}, function (frame) {
        // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });
        that.stompClient.subscribe("/" + code, (message) => {
          if (message.body) {
            let receivedValue = JSON.parse(message.body);
            console.log(receivedValue);
            res(message.body)
          }
        }, () => {
          rej("Data Error")
          return alert("koneksi terputus");
        });
      }, err => {
        rej("Data Error")
        return alert("gagal menghubungkan ke server");
      });
    });
    return proms;
  }

  async initSocketCustomer(code) {

    let ws = new SockJS(this.serverLocal);
    this.stompClient = Stomp.over(ws);
    let that = this;

    let proms = new Promise((res, rej) => {
      this.stompClient.connect({}, function (frame) {
        // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });
        // console.log(this.stomp.status);


        //   if (this.stomp.status === 'CONNECTED') {
        //     // do stuff that requires a connection, like establish subscriptions
        // }

        that.stompClient.subscribe("/" + code, (message) => {
          if (message.body) {
            let receivedValue = JSON.parse(message.body);

            if (receivedValue['success']) {
              res(message.body)
              // } else {
              //   try {
              //     this.asyncMethod(code)
              //   } catch (error) {
              //     console.log(error);

              //   }
            }

            // console.log(receivedValue);

          }
        }, () => {
          rej("Data Error")
          return alert("koneksi terputus");
        });
      }, err => {
        rej("Data Error")
        return alert("gagal menghubungkan ke server");
      });
    });
    return proms;
  }


  disconnectSocket() {
    console.log("disconnected");
    this.stompClient.disconnect()
  }

  async asyncMethod(code) {
    const value = await this.initSocketCustomer(code)
    console.log(value);
    return value;
  }








}


