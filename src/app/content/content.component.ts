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


  constructor(private queue: QueueService) { }

  ngOnInit() {
    this.getDataQueue()
  }

  getDataQueue() {
    let data = this.ls.get('user')
    var brch = data.record['branchcode'];


    this.queue.getDataQue(brch, 999).subscribe(res => {
      console.log(res);
      this.dataQueue = res;
    })


  }

}
