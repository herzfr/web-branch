import { Component, OnInit } from '@angular/core';
import { QueueService } from '../services/queue.service';
import * as securels from 'secure-ls';
import { interval } from 'rxjs';

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
    }, 5000)


    // const source = interval(3000);
    // const subscribe = source.subscribe(val =>
    //   this.getDataQueue());
  }

  getDataQueue() {
    let data = this.ls.get('user')
    var brch = data.record['branchcode'];

    this.queue.getDataQue(brch, 999).subscribe(res => {
      // console.log(res);
      this.dataSource = res;

      var index = 0;
      this.dataSource.forEach(element => {
        //  console.log(element.transbuff);

        let data = JSON.parse(element.transbuff);


        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const elData = data[key];

            console.log(elData);

            for (let index = 0; index < elData.length; index++) {
              const elements = elData[index];
              console.log(elements);
              console.log(elements.name);



            }



          }
        }

        this.dataSource[index].label = data.type;

        // console.log(data);
        console.log(
          this.dataSource[index]);


        index++;
      });

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


