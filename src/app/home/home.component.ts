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
import { UtilityService } from '../services/utility.service';

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
   // version = VERSION;
   navItems: NavItem[] = [
    {
      displayName: 'Financial Retail',
      iconName: 'financial-retail.svg',
      children: [
        {
          displayName: 'Antrian Teller',
          iconName: 'chevron_right',
          route: "/home/teller",
          children: []
        },
        {
          displayName: 'Antrian CS',
          iconName: 'chevron_right',
          route: "/home/cs",
          children: []
        },
        {
          displayName: 'Head Teller DashBoard',
          iconName: 'chevron_right',
          route: "/home/head-teller",
          children: []
        },
        {
          displayName: 'Head CS DashBoard',
          iconName: 'chevron_right',
          route: "/home/head-cs",
          children: []
        },
        {
          displayName: 'Penerimaan dari Teller lain',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
        {
          displayName: 'Setoran Tunai',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
        {
          displayName: 'Penarikan Tunai',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
        {
          displayName: 'Pemindahbukuan Beda Mata Uang',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
        {
          displayName: 'Banknote Cross Currency',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        }

      ]
    },
    {
      displayName: 'Report',
      iconName: 'report.svg',
      children: [
        {
          displayName: 'Report Transaksi Harian Teller',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
      ]
    },
    {
      displayName: 'Pembayaran',
      iconName: 'payment.svg',
      children: [
        {
          displayName: 'Open Payment',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
        {
          displayName: 'Close Payment',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
      ]
    },
    {
      displayName: 'Cash Drawer',
      disabled: false,
      iconName: 'cash-drawer.svg',
      children: [
        {
          displayName: 'Teller Cash Drawer',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        },
        {
          displayName: 'Denominasi',
          iconName: 'chevron_right',
          route: "/home/",
          children: []
        }
      ]
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
    private route: Router, private userService: UserService, private sharedService: SharedService, private utilityService: UtilityService) {
    this.setInfoNavbar();
  }

  ngOnInit() {
    $(document).ready(function () {
      $('#nav-icon').click(function () {
        $(this).toggleClass('open');
      });
    });
    this.userVoid();
    this.checkSessionIat();

    let dataRoles: any = this.userService.getUserRoles();
    // console.log("isi roles ", dataRoles);

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
    // console.log("raw : ", data.lastlogindate);
    // console.log("date :", date);

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
