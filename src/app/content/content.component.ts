import { Component, OnInit } from '@angular/core';
import { QueueService } from '../services/queue.service';
import * as securels from 'secure-ls';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  dataQueue: any;
  ls = new securels({ encodingType: 'aes' });

  displayedColumns = ['timestampentry', 'queueno', 'type', 'nominal', 'acctyp', 'inf'];
  // dataSource = ELEMENT_DATA;
  dataSource: any;


  constructor(private queue: QueueService) { }

  ngOnInit() {
    this.getDataQueue()

    setTimeout(() => {
      console.log(this.dataQueue);
    }, 3000)


  }

  getDataQueue() {
    let data = this.ls.get('user')
    var brch = data.record['branchcode'];

    this.queue.getDataQue(brch, 999).subscribe(res => {
      // console.log(res);
      this.dataSource = res;
    })


  }

}

export interface PeriodicElement {
  timestampentry: string;
  queueno: number;
  type: string;
  nominal: number;
  acctyp: string;
  inf: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { timestampentry: Date(), queueno: 1, type: 'Transaksi Antar Bank', nominal: 100000, acctyp: 'Giro', inf: 'Test Aja' },

];


