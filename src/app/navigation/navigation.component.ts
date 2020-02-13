import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap';
import * as securels from 'secure-ls';
import { HttpClient } from '@angular/common/http';
import { ConnectionService } from 'ng-connection-service';
import { Router } from '@angular/router';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class NavigationComponent implements OnInit {

  subMenu: any = [
    'Pembayaran dari Teller lain',
    'Penerimaan dari Teller Lain',
    'Setoran Tunai',
    'Penarikan Tunai',
    'Pemindahbukuan Tanpa Cek',
    'pemindahbukuan Beda Mata Uang',
    'Selisih Kas Lebih',
    'Setoran Tunai Beda Mata Uang',
    'Penarikan Tunai Beda Mata Uang',
    'Jual Beli Valas',
    'Input Transaksi WIC',
  ]

  ls = new securels({ encodingType: 'aes' });

  userID = 'ADMIN001';
  userName = 'Dian Puspita';
  branchCode = '034';
  lastloginDate: number = Date.now()
  today: number = Date.now();
  ipAddress: any;
  status = 'Online';
  isConnected = true;

  constructor(private router: Router, private http: HttpClient, private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe(isConnect => {
      this.isConnected = isConnect;

      if (this.isConnected) {
        this.status = 'Online'
      } else {
        this.status = 'Offline'
      }

    })
  }

  ngOnInit() {
    this.collapse()
    this.getUserData()
    this.getIPAddress()
  }

  collapse() {
    (function ($) {

      "use strict";

      var fullHeight = function () {

        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function () {
          $('.js-fullheight').css('height', $(window).height());
        });

      };
      fullHeight();

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });

    })(jQuery)
  }

  getUserData() {
    let dataUser = this.ls.get('user')
    for (const key in dataUser) {
      if (dataUser.hasOwnProperty(key)) {
        const element = dataUser[key];
        this.userID = element.userid
        this.userName = element.username
        this.branchCode = element.branchcode
        this.convertDate(element.lastlogindate)
      }
    }
  }

  convertDate(date) {
    var date: any = new Date(date)
    this.lastloginDate = date;
  }

  getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/login'])
  }

}
