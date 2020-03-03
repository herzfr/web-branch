import { Component, OnInit } from '@angular/core';
import { NavItem } from '../models/nav-item';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // version = VERSION;
  navItems: NavItem[] = [
    {
      displayName: 'Financial Retail',
      iconName: 'close',
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
      iconName: 'close',
      children: []
    },
    {
      displayName: 'Passbook',
      iconName: 'feedback',
      route: 'feedback'
    },
    {
      displayName: 'Pembayaran',
      iconName: 'close',
      children: []
    },
    {
      displayName: 'Cash Drawer',
      disabled: true,
      iconName: 'close',
      children: []
    }
  ];


  constructor() {

  }

  ngOnInit() {

    $(document).ready(function () {
      $('#nav-icon').click(function () {
        $(this).toggleClass('open');
      });
    });


  }

}
