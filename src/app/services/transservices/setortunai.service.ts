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

    console.log("setor tunai Data ", dataObject);

    //change transbuff to stringify
    let dataProses = dataObject;
    let transBuffer = dataProses.transbuff;
    transBuffer = transBuffer;
    dataProses.transbuff = transBuffer;

    //change transaction status to 200
    dataObject.status = 200;

    console.log("data proses : ", dataProses);

    let promise = new Promise((resolve, reject) => {


      let objectWbtrans = JSON.stringify(dataProses.transbuff);

      console.log("object wbtrans ", objectWbtrans);

      let dataSend = dataProses;
      dataSend.transbuff = objectWbtrans;


      // proses transaksi ke table wbtrans 
      this.queueService.processTransactionDataQ(dataSend).subscribe(response => {
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
            wbtrty: this.utilityService.asciiToHexa(dataProses.trntype),
            wbtrbf: {
              wstype: "0030003000300030003000300031",
              wstoto: this.utilityService.asciiToHexa(wstoto),
              wsnomn: this.utilityService.asciiToHexa(this.utilityService.leftPadding(wsnom, "0", 17)),
              // wbicsh: this.utilityService.asciiToHexa(dataProses.isCash ? dataObject.isCash : "000"),
              wbicus: "003000300031"
            },
            wbstop: "0045004E0044"
          };

          // send inquiry to server 
          this.sendInquiry(inquiryObject).subscribe(resp => {
            resp["reffNo"] = reffNo;
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

  // posting setor tunai function 
  async prosesPosting(dataObject: any) {

    console.log("data object that sending : ", dataObject);

    let dataProses = dataObject;
    var transBuffer = dataProses.transbuff;
    transBuffer = transBuffer;

    console.log("data proses : ", dataProses);



    // //change from hex to ascii
    // for (const key in transBuffer) {
    //   if (transBuffer.hasOwnProperty(key)) {
    //     const element = transBuffer[key];
    //     console.log("data element : ", element);
    //     console.log("data key : ", key);
    //     transBuffer[key] = this.utilityService.hexToAscii(element);
    //   }
    // }

    // dataProses.userid = this.userId;
    // dataProses.userterminal = this.userTerminal;
    // dataProses.queuedate = this.utilityService.getDateWithDash();
    // dataProses.transbuff = JSON.stringify(dataProses.transbuff);

    // let promise = new Promise((resolve, reject) => {
    //   this.queueService.processTransactionDataQ(dataProses).subscribe(response => {
    //     console.log("wbtrans response : ", response);

    //     let traceNo = response['traceno'];
    //     let postingObject: any = {
    //       wbtmsg: "0030003100300030",
    //       wbproc: "003900300030003000300030",
    //       wbtrid: this.utilityService.asciiToHexa(dataProses.transid),
    //       wbbrcd: this.utilityService.asciiToHexa(dataProses.branchcode),
    //       wbfgid: this.utilityService.asciiToHexa(dataProses.userid ? dataProses.userid : ""),
    //       wbscid: this.utilityService.asciiToHexa(dataProses.scanid ? dataProses.scanid : ""),
    //       wbqucd: "0030003000300030003000300030003000300031",
    //       wbqudt: this.utilityService.asciiToHexa(this.utilityService.getDateWithoutSeparator()),
    //       wbrfno: this.utilityService.asciiToHexa(traceNo.toString()),
    //       wbstat: this.utilityService.asciiToHexa("200"),
    //       wbtmid: this.utilityService.asciiToHexa(dataProses.terminalid),
    //       wbtsen: this.utilityService.asciiToHexa(this.utilityService.convertMilisToDateTimeStamp(dataProses.timestampentry)),
    //       wbtspr: this.utilityService.asciiToHexa(this.utilityService.getDateTimeStamp()),
    //       wbtcno: this.utilityService.asciiToHexa(traceNo.toString()),
    //       wbusid: this.utilityService.asciiToHexa(this.userId),
    //       wbustm: this.utilityService.asciiToHexa(this.userTerminal ? this.userTerminal : ""),
    //       wbtrbf: {
    //         wstype: "0039003000300030003000300031",
    //         wstoto: this.utilityService.asciiToHexa(transBuffer.wstoto),
    //         wsnomn: this.utilityService.asciiToHexa(this.utilityService.leftPadding(transBuffer.wsnomn, "", 17)),
    //         wbicsh: this.utilityService.asciiToHexa(dataProses.isCash ? dataProses.isCash : "000"),
    //         wbicus: "003000300031",
    //         // wsapprc: "20200626200747761000",


    //         //     "wstype": "0000001",
    //         // "wsbcod": "",
    //         // "wsbrta": "",
    //         // "wsfrom": "",
    //         // "wstoto": "1001000002",
    //         // "wsnomn": "00000000001000000",
    //         // "wbicsh": "",
    //         // "wbicus": "001",
    //         // "wspayc": "",
    //         // "wsbilid": "",
    //         // "wsblclr": "",
    //         // "wsbllg": "",
    //         // "wsblhld": "",
    //         // "wsbloth": "",
    //         // "wsfrnm": "",
    //         // "wstonm": "Cox Ganteng Banget",
    //         // "wsapprc": "20200626200747761000",
    //         // "wsotov": "",
    //         // "wsdspo": "",
    //         // "wsprto": ""
    //       },
    //       wbstop: "0045004E0044"
    //     };

    //     console.log("data object posting : ", JSON.stringify(postingObject));

    //     // this.sendPosting(JSON.stringify(postingObject)).subscribe(resp => {
    //     //   console.log("as response : ", resp);
    //     //   resolve(resp);

    //     // })
    //   }, err => {
    //     reject(err);
    //   });

    // });

    // return promise;

  }


  sendInquiry(body: any) {
    return this.http.post(this.apiUrl + 'api/inquiry/setor', body, this.httpOptions)
  }

  sendPosting(body: any) {
    return this.http.post(this.apiUrl + 'api/posting/setor', body, this.httpOptions)
  }



}
