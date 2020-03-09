import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavItem } from '../models/nav-item';
import * as moment from 'moment';
declare var $: any;
// declare var jQuery: any;
import * as securels from 'secure-ls';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { DialogService } from '../services/dialog.service';
import { WebsocketService } from '../services/websocket.service';
import { AppConfiguration } from '../models/app.configuration';
  
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private iPAdd;
  private lastLog;
  private loginDate;
  private userName = "";
  private branchCode = "";
  secureLs = new securels({ encodingType: 'aes' });

  // version = VERSION;
  navItems: NavItem[] = [
    {
      displayName: 'Financial Retail',
      iconName: 'financial-retail.svg',
      children: [
        {
          displayName: 'Pembayaran dari Teller Lain',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Setoran Tunai',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Penarikan Tunai',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Pemindahbukuan Tanpa Cek',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Pemindahbukuan Beda Mata Uang',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Selisih Kas Lebih',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Setoran Tunai Beda Mata Uang',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Penarikan Tunai Beda Mata Uang',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Jual Beli Valas',
          iconName: 'chevron_right',
          children: []
        },
        {
          displayName: 'Input Transaksi WIC',
          iconName: 'chevron_right',
          children: []
        },
      ]
    },
    {
      displayName: 'Report',
      iconName: 'report.svg',
      children: []
    },
    {
      displayName: 'Passbook',
      iconName: 'passbook.svg',
      route: 'feedback'
    },
    {
      displayName: 'Pembayaran',
      iconName: 'payment.svg',
      children: []
    },
    {
      displayName: 'Cash Drawer',
      disabled: true,
      iconName: 'cash-drawer.svg',
      children: []
    }
  ];


  constructor(private dialog: DialogService, private websocket: WebsocketService) {
    console.log("home server : ", this.serverUrl);
    
    this.setInfoNavbar();
  }

  ngOnInit() {

    $(document).ready(function () {
      $('#nav-icon').click(function () {
        $(this).toggleClass('open');
      });
    });

    this.userVoid();
  }


  userVoid() {
    const data = JSON.parse(this.secureLs.get("data"));
    this.userName = data.username;
    this.branchCode = data.branchcode;
    const socketDestination = "usr" + this.userName;
    this.websocket.initializeWebSocketConnection(socketDestination)
  }

  setInfoNavbar() {
    var log = new Date();
    var last = new Date();
    this.iPAdd = localStorage.getItem('IP')
    this.lastLog = moment(log).format('DD/MM/YYYY HH:mm');
    this.loginDate = moment(last).format('DD/MM/YYYY');
  }

  ngOnDestroy(): void {
    this.websocket.disconnect();
  }




}
