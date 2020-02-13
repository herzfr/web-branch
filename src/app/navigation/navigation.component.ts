import { Component, OnInit } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
