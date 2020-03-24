import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { HeadTellerDialogComponent } from '../dialog/head-teller-dialog/head-teller-dialog.component';

import * as SecureLS from 'secure-ls';
import * as moment from 'moment';
import { HeadService } from '../services/head.service';
import { OtoTable } from '../models/otorisastion-table';

@Component({
  selector: 'app-head-teller',
  templateUrl: './head-teller.component.html',
  styleUrls: ['./head-teller.component.css'],

})
export class HeadTellerComponent implements OnInit {

  displayedColumns = ['teller', 'transacId', 'time', 'term', 'detail'];
  OtoTableData: any;
  dataSource = new MatTableDataSource<OtoTable>(this.OtoTableData);
  userId: string;


  ls = new SecureLS({ encodingType: 'aes' });

  constructor(public dialog: MatDialog, private headServ: HeadService) {
    let user = JSON.parse(this.ls.get('data'));
    this.userId = user['userid']

  }

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.headServ.getDataReqOtorisation(0, 60).subscribe(e => {
      console.log(e);

      let arr = new Array;
      for (const key in e) {
        if (e.hasOwnProperty(key)) {
          const el = e[key];

          console.log(el.timeStampValidation);
          var s = moment.utc(el.timeStampValidation).format("DD/MM/YYYY HH:mm:ss");

          let a = moment(el.timeStampValidation).format("DD MMM YYYY hh:mm a")
          el.timeStampValidation = moment.utc(el.timeStampValidation).format("DD/MM/YY HH:mm:ss")



          arr.push(el);
        }
      }

      this.dataSource = new MatTableDataSource<OtoTable>(arr);

    })

  }

  MainFunction(event, num: string) {
    console.log(JSON.parse(event['transbuff']), num);


    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: parseInt(num),
      message: JSON.parse(event['transbuff']),
    }
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';

    switch (num) {
      case '1':
        console.log('detail');
        this.dialog.open(HeadTellerDialogComponent, dialogConfig)

        break;
      case '2':
        console.log('reject');

        this.headServ.setState(1, event['transid'], 1, this.userId).subscribe(res => {
          console.log(res);

        })
        // this.dialog.open(HeadTellerDialogComponent, dialogConfig)

        break;
      case '3':
        console.log('confirm');
        // this.dialog.open(HeadTellerDialogComponent, dialogConfig)
        break;
      default:
        break;
    }

  }

}



export interface PeriodicElement {
  tellerName: string;
  time: string;
  termId: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },
  { tellerName: 'John', time: '10:88:22', termId: 'PCTELLER001' },

];