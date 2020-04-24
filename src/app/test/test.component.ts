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

  private serverUrl = 'https://10.62.10.28:8444/socket'
  private stompClient;

  data: any = null;
  show: boolean = false;

  constructor(private testService: TestService) {
  }

  ngOnInit() {

    const username = "herza";
    this.initializeWebSocketConnection("vldspvcs" + username);

  }


  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {

      that.stompClient.subscribe("/" + socket, (message) => {
        if (message.body) {
          console.log("body : ", message.body);

        }
      }, () => {


      });
    }, err => {

    });
  }

  disconectSocket() {
    this.stompClient.disconnect();
  }

  disconnect() {
    this.stompClient.disconnect();
  }

}
