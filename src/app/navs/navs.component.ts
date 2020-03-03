import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavItem } from '../models/nav-item';

@Component({
  selector: 'app-navs',
  templateUrl: './navs.component.html',
  styleUrls: ['./navs.component.css']
})
export class NavsComponent implements OnInit {
  @Input() items: NavItem[];
  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor() { }

  ngOnInit() {
  }

}
