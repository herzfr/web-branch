import { Injectable } from '@angular/core';
import { UtilityService } from '../utility.service';

import * as securels from 'secure-ls';
import { QueueService } from '../queue.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConfiguration } from 'src/app/models/app.configuration';

@Injectable({
  providedIn: 'root'
})
export class SetortunaiService {

  private userData: any;
  private userId: any;
  private userTerminal: any;

  private apiUrl;
  private apiSocket;

  private ls = new securels({ encodingType: 'aes' });
  private token = this.ls.get('token')

  headers_object = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.token);

  httpOptions = {
    headers: this.headers_object
  };


  constructor(
    private utilityService: UtilityService,
    private queueService: QueueService,
    private http: HttpClient,
    private appConfiguration: AppConfiguration) {

    //config end point
    this.apiUrl = this.appConfiguration.ipServer;
    this.apiSocket = this.appConfiguration.ipSocketServer;

    // Get Data User
    this.userData = JSON.parse(this.ls.get('data'))
    this.userId = this.userData.userid;
    this.userTerminal = this.userData.userterminal;
  }


  async processInquiry(dataObject: any) {

    // console.log("data object Send : ", dataObject);

    //change transbuff to stringify
    let dataProses = dataObject;
    let transBuffer = dataProses.transbuff;
    transBuffer = JSON.stringify(transBuffer);
    dataProses.transbuff = transBuffer;

    //change transaction status to 200
    dataObject.status = 200;

    // proses transaksi ke table wbtrans 

    let promise = new Promise((resolve, reject) => {

      this.queueService.processTransactionDataQ(dataProses).subscribe(response => {
        //jika response sukses
        if (response['success']) {
          let reffNo = response['reffno'];
          let traceNo = response['traceno'];

          // get rekening tujuan & nominal setor tunai 
          let wstoto = dataProses.transbuff.wstoto;
          let wsnom = dataProses.transbuff.wsnomn;

          //create hexa object for inquiry 
          let inquiryObject: any = {
            wbtmsg: "0030003100300030",
            wbproc: "003900300030003000300030",
            wbtrid: this.utilityService.asciiToHexa(dataProses.transid),
            wbbrcd: this.utilityService.asciiToHexa(dataProses.branchcode),
            wbfgid: this.utilityService.asciiToHexa(dataProses.userid ? dataProses.userid : ""),
            wbscid: this.utilityService.asciiToHexa(dataProses.scanid ? dataProses.scanid : ""),
            wbqucd: "0030003000300030003000300030003000300031",
            wbqudt: this.utilityService.asciiToHexa(dataProses.queuedate),
            wbrfno: this.utilityService.asciiToHexa(reffNo),
            wbstat: this.utilityService.asciiToHexa("200"),
            wbtmid: this.utilityService.asciiToHexa(dataProses.terminalid),
            wbtsen: this.utilityService.asciiToHexa(this.utilityService.convertMilisToDateTimeStamp(dataProses.timestampentry)),
            wbtspr: this.utilityService.asciiToHexa(this.utilityService.getDateTimeStamp()),
            wbtcno: this.utilityService.asciiToHexa(traceNo.toString()),
            wbusid: this.utilityService.asciiToHexa(this.userId),
            wbustm: this.utilityService.asciiToHexa(this.userTerminal ? this.userTerminal : ""),
            wbtrbf: {
              wstype: "0030003000300030003000300031",
              wstoto: this.utilityService.asciiToHexa(wstoto),
              wsnomn: this.utilityService.asciiToHexa(wsnom),
              wbicsh: this.utilityService.asciiToHexa(dataProses.isCash ? dataObject.isCash : "000"),
              wbicus: "003000300030"
            },
            wbstop: "0045004E0044"
          };


          // send inquiry to server 
          this.sendInquiry(inquiryObject).subscribe(resp => {
            // console.log("response inquiry", resp);
            resolve(resp);
          }, err => {
            // console.log("inquiry error");
            reject();
            return null;
          })
        }
        else {// if response not sukse 
          reject(null)
          return null;
        }
        // if error on connection
      }, err => {
        console.log("error get data ", err);
        reject(err);
        return null;
      })



    });


    return promise;



  }


  prosesWbtrans() {

  }

  sendInquiry(body: any) {
    return this.http.post(this.apiUrl + 'api/inquiry/setor', body, this.httpOptions)
  }



}
