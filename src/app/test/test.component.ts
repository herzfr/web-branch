import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import * as crypto from 'crypto-js';
import * as moment from 'moment';
import { NgForm, FormControl } from '@angular/forms';
import { TestService } from './test.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { FormCanDeactivate } from '../utility/form-can-deactivate/form-can-deactivate';
import * as SecureLS from 'secure-ls';

declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  private serverUrl = 'http://localhost:1111/socket';
  private stompClient;

  data: any = null;
  show: boolean = false;

  constructor(private testService: TestService) {
  }

  ngOnInit() {

    this.initializeWebSocketConnection("nasabahbiometric");

  }


  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {

      that.stompClient.subscribe("/" + socket, (message) => {

        if (message.body) {

          let data = JSON.parse(message.body);

          that.data = 'data:image/jpeg;base64,' + data.imageFinger1;

          console.log(data);

          that.show = true;


          return message.body;
        }

      }, () => {
        // that.dialog.errorDialog("Error", "Koneksi Terputus");
        console.log("koneksi terputus");

      });
    }, err => {
      console.log("gagal menghubungkan ke server ");

      // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }

  disconnect() {
    this.stompClient.disconnect();
  }

}
