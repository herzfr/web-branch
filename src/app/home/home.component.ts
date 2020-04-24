import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavItem } from '../models/nav-item';
import * as moment from 'moment';

import * as securels from 'secure-ls';
import { DialogService } from '../services/dialog.service';
import { WebsocketService } from '../services/websocket.service';
import { DataBranchServices } from '../services/data-branch.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SharedService } from '../services/shared.service';
import { MatSidenav } from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private iPAdd;
  private lastLog;
  private lastLoghour;
  private loginDate;
  private userName = "";
  private branchCode = "";
  private branchDescript = "";
  private firstName = "";
  private lastName = "";

  isMenuVisible: boolean = true;

  private branchSub: Subscription;

  secureLs = new securels({ encodingType: 'aes' });

  // version = VERSION;
  navItems: NavItem[] = [
    {
      displayName: 'Financial Retail',
      iconName: 'financial-retail.svg',
      children: [
        {
          displayName: 'Teller DashBoard',
          iconName: 'chevron_right',
          route: "/home/teller",
          children: []
        },
        {
          displayName: 'Head Teller DashBoard',
          iconName: 'chevron_right',
          route: "/home/head-teller",
          children: []
        },
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
    },
    {
      displayName: 'Setting',
      iconName: 'passbook.svg',
      children: [
        {
          displayName: 'User Table',
          iconName: 'chevron_right',
          route: "/account",
          children: []
        }
      ]
    }
  ];

  @ViewChild('drawer', { static: false }) public drawer: MatSidenav;


  constructor(private dialog: DialogService, private websocket: WebsocketService, private branchService: DataBranchServices,
    private route: Router, private userService: UserService, private sharedService: SharedService) {
    this.setInfoNavbar();
  }

  ngOnInit() {
    $(document).ready(function () {
      $('#nav-icon').click(function () {
        $(this).toggleClass('open');
      });
    });
    this.userVoid();

    let dataRoles: any = this.userService.getUserRoles();
    console.log("isi roles ", dataRoles);

    this.sharedService.isVisibleSource.subscribe((isVisible: boolean) => {
      this.isMenuVisible = isVisible;
      if (this.isMenuVisible === false) {
        this.drawer.close();
      }
    });


  }

  // get user data 
  userVoid() {
    this.checkSessionIat();
    const data = JSON.parse(this.secureLs.get("data"));

    this.branchSub = this.branchService.getBranchByCode(data.branchcode).subscribe(res => {
      this.branchDescript = res['record'].description;
    });

    this.userName = data.username;
    this.branchCode = data.branchcode;
    this.firstName = data.firstname;
    this.lastName = data.lastname;

    const date = moment(data.lastlogindate).locale('ID').format('Do MMMM  YYYY')
    console.log("raw : ", data.lastlogindate);

    console.log("date :", date);

    this.lastLog = data.lastlogindate
    // this.lastLoghour = data.lastlogindate


    const socketDestination = "usr" + this.userName;
    this.websocket.initializeWebSocketConnection(socketDestination)
    setTimeout(() => {
      if (this.branchSub) {
        this.branchSub.unsubscribe();
      }
    }, 2000);
  }

  checkSessionIat() {

    try {
      const iat = this.secureLs.get('iat');
      let ms = moment(Date.now()).diff(iat);
      let d = moment.duration(ms);
      let dif = Math.floor(d.asHours());
      if (dif > 8) {
        alert("Sesion anda sudah berakhir, mohon login kembali");
        this.logout();
      }
    } catch (error) {
      alert("Sesion anda sudah berakhir, mohon login kembali");
      this.logout();
    }

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

  logout() {
    localStorage.removeItem('data');
    localStorage.removeItem('termdata');
    localStorage.removeItem('iat');
    this.route.navigate(['/login']);
  }

}
