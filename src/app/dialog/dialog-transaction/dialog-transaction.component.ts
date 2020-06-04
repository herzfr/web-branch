import { Component, OnInit, Inject, ViewChild, Input, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatGridTileHeaderCssMatStyler, MatStepper, MatSidenav, MatDrawer } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { QueueService } from 'src/app/services/queue.service';
declare var $: any;

import * as SecureLS from 'secure-ls';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { TransactionService } from 'src/app/services/transaction.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as securels from 'secure-ls';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppConfiguration } from 'src/app/models/app.configuration';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ListingService } from 'src/app/services/listing.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.css', './dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {
  private TERMINAL: any = [];

  private data: any;
  private dataForm: any;
  private noQ: any;
  // private isCust: any;

  private isLinear = true;
  private isProsses = true;
  private isSuccess = false;
  private isError = false;
  private isBack = false;
  private isNext = false;

  // Main Button
  private isCancelBtn: boolean = true;
  private isSkipBtn: boolean = true;
  private isDoneBtn: boolean = false;

  private form: FormArray;
  private formGroup: FormGroup;
  private dataSuccess = new Array;

  private transID_for_while: string;
  private status_for_while: number;

  private stepDisabled: boolean = true;
  private stepDisabledHorizontal: boolean = false;

  private dataFormHeadValidation: any;
  private dataFormActual: any;

  private isCloseDialog: boolean = true;
  private secureLs = new SecureLS({ encodingType: 'aes' });
  private config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '30px',
      'height': '30px',
      'font-size': '20px',
      'margin-right': '0px',
      'border': '1px solid transparent',
      'border-right-color': '#234A7B',
      'color': '#234A7B',
      'border-radius': '0px'
    }
  };
  // otorisasi pin Nasabah true false
  private isPinMessageSuccess: boolean = false;
  private isPinMessageError: boolean = false;
  private isScanFinger: boolean = false;
  private isSwapCard: boolean = true;
  private isInputPin: boolean = false;
  private isCardNumber: boolean = false;
  private isFingerError: boolean = false;
  private isFingerSuccess: boolean = false;
  // otorisasi pin Nasabah data
  private cardNum: number;
  private pinMessage: string;
  private fingerMessage: string;
  private isCheckSaldo: boolean;

  // Otorisasi Head Teller
  private isDisplayPrint: boolean = false;
  private isDisplayPrintSaldo: boolean = false;
  private isWaitingConfirmation: boolean = false;
  private isRejectConfirmation: boolean = false;

  private nameHead: any = [];
  private isHeadTeller: boolean = false;

  private saldoData: any;


  // Otorisasi Head Teller
  private options: AnimationOptions = {
    path: '/assets/lottie/fingerprint.json'
  };
  private optionWaiting: AnimationOptions = {
    path: '/assets/lottie/loading-verify.json'
  };
  private optionReject: AnimationOptions = {
    path: '/assets/lottie/reject.json'
  };

  private base64Image = 'assets/png/avatar.png';
  private base64Sign = 'assets/png/signature.png';
  private NAME_CUST = 'John Lennon';
  private imageID;

  private serverUrl = 'http://localhost:1111/socket';
  private serverUrlSocket;
  private stompClient;
  private stompClientSocket;

  private ls = new securels({ encodingType: 'aes' });
  private token = this.ls.get('token')

  private headSelectTeller: any;
  private animationItem: AnimationItem;

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('ngOtpInput', { static: true }) ngOtpInputRef: any;

  // transaction code 
  setorTunaiCode: string;
  tarikTunaiCode: string;
  transferAntarRekCode: string;
  transferAntarBankCode: string;
  newAccountCode: string;
  informasiSaldoTabunganCode: string;
  informasiSaldoGiroCode: string;

  transLabel: any = new Array;

  constructor(private dialogRef: MatDialogRef<DialogTransactionComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private _formBuilder: FormBuilder,
    private queueServ: QueueService, private transacServ: TransactionService, private sanitizer: DomSanitizer, private ngZone: NgZone, private appConfig: AppConfiguration,
    private configuration: ConfigurationService, private listConv: ListingService, private utilityService: UtilityService) {

    this.data = data.data;
    // console.log("data length : ", data.data.length);

    this.TERMINAL = JSON.parse(this.ls.get('terminal'))

    this.setorTunaiCode = this.configuration.getConfig().typeSetorTunai;
    this.tarikTunaiCode = this.configuration.getConfig().typeTarikTunai;
    this.transferAntarRekCode = this.configuration.getConfig().typeTransferAntarRek;
    this.transferAntarBankCode = this.configuration.getConfig().typeTransferAntarBank;
    this.newAccountCode = this.configuration.getConfig().typeNewAccount;
    this.informasiSaldoGiroCode = this.configuration.getConfig().typeCheckSaldoGiro;
    this.informasiSaldoTabunganCode = this.configuration.getConfig().typeCheckSaldoTabungan;

    this.serverUrlSocket = this.appConfig.ipSocketServer;

    let forms = new Array;
    for (const key in data.data) {
      if (data.data.hasOwnProperty(key)) {
        const element = data.data[key];
        // console.log(element.trntype);
        this.noQ = element.queueno;
        let changeKey = element.transbuff[0]
        this.transID_for_while = element.transid
        this.status_for_while = element.status

        if (changeKey.tp === this.tarikTunaiCode) {
          this.transLabel.push("Tarik Tunai");
          changeKey.tp = 'Tarik Tunai'
        } else if (changeKey.tp === this.setorTunaiCode) {
          this.transLabel.push("Setor Tunai");
          changeKey.tp = 'Setor Tunai'
        } else if (changeKey.tp === this.transferAntarRekCode) {
          this.transLabel.push("Transaksi Antar Rekening");
          changeKey.tp = 'Transaksi Antar Rekening'
        } else if (changeKey.tp === this.transferAntarBankCode) {
          this.transLabel.push("Transaksi Antar Bank");
          changeKey.tp = 'Transaksi Antar Bank'
        } else if (changeKey.tp === this.informasiSaldoGiroCode) {
          this.transLabel.push("Informasi Saldo Giro");
          changeKey.tp = 'Informasi Saldo Giro'
        } else if (changeKey.tp === this.informasiSaldoTabunganCode) {
          this.transLabel.push("Informasi Saldo Tabungan");
          changeKey.tp = 'Informasi Saldo Tabungan'
        }

        if (changeKey.tn === '1') {
          changeKey.tn = 'Ya'
        } else if (changeKey.Tunai === '0') {
          changeKey.tn = 'Tidak'
        }

        // console.log(changeKey.Tunai);
        let dataForm = { "transid": element.transid, "transbuff": element.transbuff[0], "trntype": element.trntype };
        forms.push(dataForm)
      }
    }
    this.dataForm = forms;
  }

  ngOnInit() {

    this.formGroup = this._formBuilder.group({
      form: this._formBuilder.array([this.init('')])
    })

    for (const key in this.dataForm) {
      if (this.dataForm.hasOwnProperty(key)) {
        const element = this.dataForm[key];
        this.addItem(element.transbuff, element.transid);
      }
    }
    this.form.removeAt(0)
  }

  init(event) {
    // console.log(event);
    const orderFormGroup: FormGroup = new FormGroup({});
    for (const key in event) {
      if (event.hasOwnProperty(key)) {
        const el = event[key];
        const control: FormControl = new FormControl(el, Validators.required);
        orderFormGroup.addControl(key, control);
      }
    }
    return orderFormGroup;
  }

  addItem(event, transid) {
    event.TransaksiId = transid;
    this.form = this.formGroup.get('form') as FormArray;
    this.form.push(this.init(event));
  }


  cancelQ() {
    let postStat = new Array;
    this.dataForm.forEach(e => {
      console.log(e.transid);
      let obj: any = new Object();
      obj.transId = e.transid;
      obj.status = '100';
      obj.batal = true;
      postStat.push(obj)
    });

    this.dialogRef.close(postStat);

  }

  skipQ() {
    let postStat = new Array;
    this.dataForm.forEach(e => {
      console.log(e.transid);
      let obj: any = new Object();
      obj.transId = e.transid;
      obj.status = '998';
      obj.skip = true;
      postStat.push(obj)
    });

    this.dialogRef.close(postStat)

  }

  prosesQ() {

    let postStat = new Array;
    this.dataForm.forEach(e => {
      console.log(e.transid);
      let obj: any = new Object();
      obj.transId = e.transid;
      obj.status = '000';
      obj.proses = true;
      postStat.push(obj)
    });

    this.dialogRef.close(postStat);
  }


  transactionCancel(i, event, stepper) {
    console.log(i, event, stepper)

    let arr = new Array;
    let obj: any = new Object();
    obj.transId = event.TransaksiId.value;
    obj.status = '100';

    console.log(obj);
    arr.push(obj)

    this.queueServ.changeStatusTransactionQ(arr).subscribe(e => {
      console.log(e);
      if (e['successId0']) {
        this.form.removeAt(i)
        this.done()
      } else {
        console.log('data tidak sukses');
      }
    })
  }

  transactionProcess(event, index, stepper: MatStepper) {

    console.log("process data :", event);


    for (const key in event) {
      if (event.hasOwnProperty(key)) {
        const element = event[key];

        switch (key) {
          case 'TransaksiId':
            event.wstran = element;
            delete event.TransaksiId;
            break;
          case 'nm':
            event.wsnomn = element;
            delete event.nm;
            break;
          case 'tn':
            event.wsicas = element;
            delete event.tn;
            break;
          case 'tp':
            event.wstype = element;
            delete event.tp;
            break;
          case 'fr':
            event.wsfrom = element;
            delete event.fr;
            break;
          case 'to':
            event.wstoto = element;
            delete event.to;
            break;
          case 'br':
            event.wsbrta = element;
            delete event.br;
            break;
          case 'bc':
            event.wsbcod = element;
            delete event.bc;
            break;
          case 'id':
            event.wsidid = element;
            delete event.id;
            break;
          default:
            break;
        }
      }
    }

    console.log("event after : ", event);


    let accountNumber: any;
    if (event.wsfrom === undefined) {
      this.cardNum = 1234567890000003;
    } else {
      accountNumber = event.wsfrom;
      console.log("account number :", accountNumber.value);

      switch (accountNumber.value) {
        case "1001000002":
          this.cardNum = 1234567890000002;
          break;
        case "1001000003":
          this.cardNum = 1234567890000003;
          break;
        default:
          this.cardNum = 1234567890000003;
          break;
      }
    }

    let transId = event.wstran.value;
    let dataObj = this.findDataByTransactionId(transId, this.data);
    let terminal = JSON.parse(this.secureLs.get("terminal"));
    let branchCode = terminal.branchCode;
    let term = terminal.terminalID;

    let Form = new FormGroup(event)
    let payLoad = JSON.stringify(Form.value);
    let payLoadHex = JSON.parse(JSON.stringify(Form.value))

    console.log("payload: ", dataObj);


    // change value by transaction code 
    switch (payLoadHex.wstype) {
      case "Informasi Saldo Giro":
        this.isCheckSaldo = true;
        payLoadHex.wstype = this.informasiSaldoGiroCode;
        break;
      case "Informasi Saldo Tabungan":
        this.isCheckSaldo = true;
        payLoadHex.wstype = this.informasiSaldoTabunganCode;
        break;
      case "Tarik Tunai":
        this.isCheckSaldo = false;
        payLoadHex.wstype = this.tarikTunaiCode;
        break;
      case "Setor Tunai":
        this.isCheckSaldo = false;
        payLoadHex.wstype = this.tarikTunaiCode;
        break;
      case "Transaksi Antar Bank":
        this.isCheckSaldo = false;
        payLoadHex.wstype = this.transferAntarBankCode;
        break;
      case "Transaksi Antar Rekening":
        this.isCheckSaldo = false;
        payLoadHex.wstype = this.transferAntarRekCode;
        break;
      default:
        this.isCheckSaldo = false;
        break;
    }

    // convert json value string to custom hex value
    for (const key in payLoadHex) {
      if (payLoadHex.hasOwnProperty(key)) {
        const element = payLoadHex[key];
        if ((typeof (element)) === 'string') {
          payLoadHex[key] = this.utilityService.asciiToHexa(element)
        } else if ((typeof (element)) === 'number') {
          payLoadHex[key] = this.utilityService.asciiToHexa(element.toString())
        } else {
          payLoadHex[key] = this.utilityService.asciiToHexa(element.toString())
        }
      }
    }

    if (event.wstype.value === 'Tarik Tunai') {
      event.wstype.value = this.tarikTunaiCode
    } else if (event.wstype.value === 'Setor Tunai') {
      event.wstype.value = this.setorTunaiCode;
    } else if (event.wstype.value === 'Transaksi Antar Rekening') {
      event.wstype.value = this.transferAntarRekCode
    } else if (event.wstype.value === 'Transaksi Antar Bank') {
      event.wstype.value = this.transferAntarBankCode
    } else if (event.wstype.value === 'Informasi Saldo Tabungan') {
      event.wstype.value = this.informasiSaldoTabunganCode
    } else if (event.wstype.value === 'Informasi Saldo Giro') {
      event.wstype.value = this.informasiSaldoGiroCode
    }

    console.log("event value: ", event);
    console.log("cash data: ", this.data[index].isCash);
    console.log("is cash data: ", this.data[index].isCash);


    const dataFormValidation = {
      "transid": transId,
      "branchcode": branchCode,
      "terminalid": term,
      "queuedate": dataObj.queuedate,
      "queuecode": dataObj.queuecode,
      "queueno": dataObj.queueno.toString(),
      "timestampentry": dataObj.timestampentry.toString(),
      "userid": dataObj.userid,
      "userterminal": dataObj.userterminal,
      "trntype": event.wstype.value,
      "status": "",
      "transbuff": payLoad,
      "username": JSON.parse(this.secureLs.get('data')).username,
      "id": this.data[index].username,
      "isCash": this.data[index].isCash,
      "transcnt": this.data[index].transcnt,
      "transeq": this.data[index].transeq
    }

    let scanId = this.data[index].scanid ? this.data[index].scanid : "";
    const dataProsesApi = {
      "wbtmsg": this.utilityService.asciiToHexa("0100"),
      "wbproc": this.utilityService.asciiToHexa("900000"),
      "wbtrid": this.utilityService.asciiToHexa(transId),
      "wbbrcd": this.utilityService.asciiToHexa(branchCode),
      "wbfgid": this.utilityService.asciiToHexa(dataObj.userid),
      "wbscid": this.utilityService.asciiToHexa(scanId),
      "wbicsh": this.utilityService.asciiToHexa(this.utilityService.leftPadding(this.data[index].isCash.toString(), "0", 3)),
      "wbicus": this.utilityService.asciiToHexa(this.utilityService.leftPadding(dataObj.iscustomer.toString(), "0", 3)),
      "wbqucd": this.utilityService.asciiToHexa(dataObj.queuecode),
      "wbqudt": this.utilityService.asciiToHexa(dataObj.queuedate),
      "wbrfno": "",
      "wbstat": this.utilityService.asciiToHexa("100"),
      "wbtmid": this.utilityService.asciiToHexa(term),
      "wbtsen": this.utilityService.asciiToHexa(this.utilityService.convertMilisToDateTime(dataObj.timestampentry)),
      "wbtspr": "",
      "wbtcno": "",
      "wbtrbf": payLoadHex,
      "wbtrty": this.utilityService.asciiToHexa(event.wstype.value),
      "wbusid": this.utilityService.asciiToHexa(dataObj.userid ? dataObj.userid : ""),
      "wbustm": this.utilityService.asciiToHexa(dataObj.userterminal ? dataObj.userterminal : ""),
      "wbstop": this.utilityService.asciiToHexa("END"),
    }

    this.dataFormHeadValidation = dataFormValidation;
    this.dataFormActual = dataProsesApi;

    console.log("data :", this.dataFormHeadValidation);

    stepper.next()
    this.dataSuccess.push("{\"success\":true}")
    setTimeout(() => {
      this.isProsses = false;
      this.isSuccess = true;
      $(".check-icon").show();
      this.isNext = true;
      this.isCancelBtn = false;
      this.isSkipBtn = false;
      this.stepDisabledHorizontal = true;
      this.isCloseDialog = false;
    }, 500)

  }

  findDataByTransactionId(key, object) {
    for (let index = 0; index < object.length; index++) {
      const el = object[index];
      if (object[index].transid === key) {
        return object[index]
      }
    }
  }

  removeForm(key, object) {
    for (let index = 0; index < object.length; index++) {
      const el = object[index];
      if (object[index].transid === key) {
        return delete object[index]
      }
    }
  }

  isDoor(event: number, event2: number, stepper: MatStepper): void {
    console.log(event);
    if (event > event2) {
      stepper.next()
      this.isProsses = true;
      this.isSuccess = false;
      this.isError = false;
      this.isBack = false;
      this.isNext = false;
    } else if (event < event2) {
      stepper.previous()
      this.isProsses = true;
      this.isSuccess = false;
      this.isError = false;
      this.isBack = false;
      this.isNext = false;
    }
  }

  print() {
    $('#print-section').printThis({
      debug: false,               // show the iframe for debugging
      importCSS: true,            // import parent page css
      importStyle: true,         // import style tags
      printContainer: true,       // print outer container/$.selector
      loadCSS: "./dialog-transaction.component.css",                // path to additional css file - use an array [] for multiple
      pageTitle: "",              // add title to print page
      removeInline: false,        // remove inline styles from print elements
      removeInlineSelector: false,  // custom selectors to filter inline styles. removeInline must be true
      printDelay: 333,            // variable print delay
      header: null,               // prefix to html
      footer: null,               // postfix to html
      base: false,                // preserve the BASE tag or accept a string for the URL
      formValues: true,           // preserve input/form values
      canvas: true,              // copy canvas content
      doctypeString: '...',       // enter a different doctype for older markup
      removeScripts: false,       // remove script tags from print content
      copyTagClasses: false,      // copy classes from the html & body tag
      beforePrintEvent: null,     // function for printEvent in iframe
      beforePrint: null,          // function called before iframe is filled
      afterPrint: null            // function called before iframe is removed
    });
  }

  hideParentSiblings(element): any[] {
    let parent;
    const toShow = [];

    while ((parent = element.parent()).length) {
      const visible = parent.siblings().find(':visible');
      toShow.push(visible);
      visible.hide();
      element = parent;
    }
    return toShow;
  }

  stepChanged(event, stepper) {
    stepper.selected.interacted = false;
  }

  done() {
    this.stepDisabledHorizontal = false;
    this.isHeadTeller = false
    // console.log("data sukses :", this.dataSuccess.length);
    // console.log("data form :", this.form.length);

    if (this.dataSuccess.length === this.form.length) {
      // console.log('suses di isi semua');
      this.isDoneBtn = true;
    } else {
      console.log('masih belum');
    }
  }

  closeQDialog() {
    if (this.status_for_while === 999) {
      let arr = new Array;
      let obj: any = new Object();
      obj.transId = this.transID_for_while;
      obj.status = '998';

      // console.log(obj);
      arr.push(obj)

      this.queueServ.changeStatusTransactionQ(arr).subscribe(e => {
        // console.log(e);
        if (e['successId0']) {
          if (localStorage.getItem('skip') !== null || localStorage.getItem('skip') != '') {
            var oldItems = JSON.parse(localStorage.getItem('skip')) || [];
            this.queueServ.changeStatusTransactionQ(oldItems).subscribe(eco => {
              // console.log(eco);
              if (eco['successId0']) {
                this.form.reset()
                this.formGroup.reset()
                this.queueServ.refreshQ(this.TERMINAL['branchCode']).subscribe()
                localStorage.removeItem('skip')
                this.dialogRef.close();
              } else {
                this.form.reset()
                this.formGroup.reset()
                this.queueServ.refreshQ(this.TERMINAL['branchCode']).subscribe()
                this.dialogRef.close();
              }

            })
          } else {
            // console.log('localstorage null');
            this.form.reset()
            this.formGroup.reset()
            this.queueServ.refreshQ(this.TERMINAL['branchCode']).subscribe()
            this.dialogRef.close();
          }
        } else {
          console.log('data tidak ada');
        }
      })
    } else if (this.status_for_while === 998) {
      let arr = new Array;
      let obj: any = new Object();
      obj.transId = this.transID_for_while;
      obj.status = '998';

      // console.log(obj);
      arr.push(obj)

      this.queueServ.changeStatusTransactionQ(arr).subscribe(e => {
        // console.log(e);
        if (e['successId0']) {
          if (localStorage.getItem('skip') !== null || localStorage.getItem('skip') != '') {
            var oldItems = JSON.parse(localStorage.getItem('skip')) || [];
            this.queueServ.changeStatusTransactionQ(oldItems).subscribe(eco => {
              // console.log(eco);
              if (eco['successId0']) {
                this.form.reset()
                this.formGroup.reset()
                this.queueServ.refreshQ(this.TERMINAL['branchCode']).subscribe()
                localStorage.removeItem('skip')
                this.dialogRef.close();
              } else {
                this.form.reset()
                this.formGroup.reset()
                this.queueServ.refreshQ(this.TERMINAL['branchCode']).subscribe()
                this.dialogRef.close();
              }

            })
          } else {
            this.form.reset()
            this.formGroup.reset()
            this.queueServ.refreshQ(this.TERMINAL['branchCode']).subscribe()
            this.dialogRef.close();
          }

        } else {
          console.log('data tidak ada');
        }
      })
    }
  }

  onSwapCard() {
    // console.log(this.cardNum);
    if (this.cardNum !== null) {
      this.isInputPin = true
      this.isCardNumber = true
      $('#card-swap').removeClass('blink')
    }
  }

  onOtpChange(event: any, stepper: MatStepper) {
    if (event.length == 6) {
      // console.log('cukup');
      $('.otp-input').blur();
      $('.otp-input').prop('readonly', true);
      // console.log("car number yang dikirim : " + this.cardNum);

      this.transacServ.verifyCard(this.cardNum, event).subscribe(res => {
        // console.log(res);
        if (res['success']) {
          // console.log(res['message']);
          this.isScanFinger = true;
          $('#scan-finger').addClass('blink')
          this.pinMessage = 'Pin Sukses'
          this.isPinMessageSuccess = true
          this.isPinMessageError = false
          this.transacServ.getInfoCardPerson(res['record']).subscribe(e => {
            // console.log(e);
            this.base64Image = 'data:image/png;base64,' + e['imagepict']
            this.base64Sign = 'data:image/png;base64,' + e['imagesign']
            this.NAME_CUST = e['name']
            this.imageID = e['imageid']
            this.images64()
            this.sign64()
            this.initializeWebSocketConnection('vldnas', stepper, null)
            this.transacServ.verifyFingerCust(e['imageid'], this.token).subscribe(eres => {
              // console.log(eres);
            })
          })
        } else {
          // console.log(res['message']);
          // console.log(this.ngOtpInputRef);
          $('.otp-input').prop('readonly', false);
          this.pinMessage = 'PIN ' + res['message']
          this.isPinMessageError = true
        }
      })
    } else {
      // console.log('belum cukup');
      this.pinMessage = 'Pin Masih Kurang'
      this.isPinMessageError = true
    }
  }

  callFingerVerify() {
    this.transacServ.verifyFingerCust(this.imageID, this.token).subscribe(eres => {
      // console.log(eres);
    })
  }

  images64() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Image);
  }
  sign64() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Sign);
  }

  onFingerVerify(status, stepper: MatStepper) {
    // console.log("status finger : ", status);
    // console.log("stepper status : ", stepper);
    // console.log("is check saldo : ", this.isCheckSaldo);
    if (status && !this.isCheckSaldo) {
      this.fingerMessage = 'Finger Valid'
      this.isFingerSuccess = true
      this.isFingerError = false
      $('#scan-finger').removeClass('blink')
      setTimeout(() => {
        stepper.next()
        this.disconnect()
        $('.otp-input').prop('readonly', false);
        $('.otp-input').val('');
        this.isPinMessageSuccess = false;
        this.isPinMessageError = false;
        this.isScanFinger = false;
        this.isSwapCard = true;
        this.isInputPin = false;
        this.isCardNumber = false;
        this.isFingerError = false;
        this.isFingerSuccess = false;
        this.transacServ.headTellerList('headteller', this.TERMINAL['branchCode']).subscribe(list => {
          if (list['success']) {
            this.nameHead = list['record']
          }
        })
      }, 1000)
    } else if (status && this.isCheckSaldo) {
      delete this.dataFormActual.wbtrbf.wstran;
      this.queueServ.processTransactionDataQ(this.dataFormHeadValidation).subscribe(res => {

        if (res['success']) {
          let traceNo = this.utilityService.leftPadding(res['traceno'].toString(), "0", 17);
          this.dataFormActual.wbtcno = this.utilityService.asciiToHexa(traceNo);
          this.dataFormActual.wbrfno = this.utilityService.asciiToHexa(res['reffno']);
          this.dataFormActual.wbtspr = this.utilityService.asciiToHexa(this.utilityService.getRawDateTime());

          this.queueServ.processTransactionDataQ2(this.dataFormActual).subscribe(res => {

            if (res['wbrspc'] === "0000000") {

              this.saldoData = res;
              let nominal = Number(res['wbtrbf'].wsblav);
              console.log("nominal :", nominal);
              this.saldoData.wbtrbf.wsblav = nominal.toString();
              console.log("data saldo : ", res);

              $('#scan-finger').removeClass('blink')
              setTimeout(() => {
                stepper.next()
                stepper.next()
                this.disconnect()
                $('.otp-input').prop('readonly', false);
                $('.otp-input').val('');
                this.isPinMessageSuccess = false;
                this.isPinMessageError = false;
                this.isScanFinger = false;
                this.isSwapCard = true;
                this.isInputPin = false;
                this.isCardNumber = false;
                this.isFingerError = false;
                this.isFingerSuccess = false;
                this.onCheckBalance();
              }, 1000)
            } else {
              alert("Process Transaksi Gagal")
            }
          });
        } else {
          alert('Data gagal proses, silahkan coba lagi')
          setTimeout(() => {
            this.isProsses = false;
            this.isError = true;
            this.isBack = true;
          }, 500)
        }
      })

    }
    else {
      this.isFingerError = true
      this.fingerMessage = 'Finger Invalid'
    }
  }

  initializeWebSocketConnection(socket, stepper: MatStepper, drawer: MatDrawer) {

    // console.log(stepper);
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    switch (socket) {
      case 'vldnas':
        this.stompClient.connect({}, function (frame) {
          // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });
          that.stompClient.subscribe("/" + socket, (message) => {
            if (message.body) {
              let parse = JSON.parse(message.body).success
              if (parse) {
                that.onFingerVerify(parse, stepper)
              }
            }

          }, () => {
            // that.dialog.errorDialog("Error", "Koneksi Terputus");
            setTimeout(() => {
              that.initializeWebSocketConnection(socket, stepper, drawer);
            }, 1000);

          });
        }, err => {

          setTimeout(() => {
            that.initializeWebSocketConnection(socket, stepper, drawer);
          }, 1000);
          // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
        });
        break;
      case 'vldspv':
        this.stompClient.connect({}, function (frame) {
          // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });
          that.stompClient.subscribe("/" + socket, (message) => {
            if (message.body) {
              let parse = JSON.parse(message.body).success
              // console.log("parse result : ", parse);
              if (parse) {
                that.dataFormHeadValidation.status = 999;
                that.dataFormHeadValidation.isRejected = 0
                that.dataFormHeadValidation.isValidated = 1
                that.dataFormHeadValidation.timestampprocess = Date.now().toString();
                that.dataFormHeadValidation.userterminal = JSON.parse(that.ls.get('data')).userterminal;
                that.transacServ.sendRemoteValidation(that.dataFormHeadValidation, that.headSelectTeller.userid).subscribe(resp => {
                  // console.log("response : ", resp);
                  if (resp['success']) {
                    // that.onFingerVerifyHead(parse, stepper, drawer, "onsite");
                    that.sendProcess(that.dataFormActual, that.dataFormHeadValidation, stepper, drawer, "onsite");
                  } else {
                    alert("validasi gagal");
                  }
                });
              }
            }

          }, () => {
            // that.dialog.errorDialog("Error", "Koneksi Terputus");
            // console.log("koneksi terputus");
            // console.log("Koneksi Ulang");
            setTimeout(() => {
              that.initializeWebSocketConnection(socket, stepper, drawer);
            }, 1000);
          });
        }, err => {
          alert("Gagal menghubungkan ke server");
          // console.log("gagal menghubungkan ke server ");
          // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
        });
        break;
      default:
        break;

    }
  }

  initializeWebSocketConnection2(socket, stepper: MatStepper, drawer: MatDrawer) {

    let ws = new SockJS(this.serverUrlSocket + "socket");
    this.stompClientSocket = Stomp.over(ws);
    let that = this;

    this.stompClientSocket.connect({}, function (frame) {
      // that.subOpenFinger = that.auth.openLoginApp().subscribe(() => { });
      that.stompClientSocket.subscribe("/" + socket, (message) => {
        if (message.body) {
          let receivedValue = JSON.parse(message.body);
          // console.log("socket value: ", receivedValue);
          // console.log("rejected", receivedValue.rejected);
          // console.log("success", receivedValue.success);
          if (receivedValue.rejected) {
            console.log("transaction rejected");
            that.isDisplayPrint = false;
            that.isWaitingConfirmation = false;
            that.isRejectConfirmation = true;
            // that.stepDisabledHorizontal = false;
            // this.isCloseDialog = true;
            that.isHeadTeller = false
            // stepper.next()
            that.done()
          } else {
            that.sendProcess(that.dataFormActual, that.dataFormHeadValidation, stepper, drawer, "remote");
          }
        }
      }, () => {
        // that.dialog.errorDialog("Error", "Koneksi Terputus");
        // console.log("koneksi terputus");
        // console.log("Koneksi Ulang");
        alert("koneksi terputus");
      });
    }, err => {
      alert("gagal menghubungkan ke server");
      // console.log("gagal menghubungkan ke server ");
      // console.log("Menghubungkan Ulang");
    });
  }

  disconnect() {
    this.stompClient.disconnect();
  }

  openSideNav() {
    console.log(this.sidenav);
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    // console.log(animationItem);
  }

  close(reason: string) {
    console.log(reason);
    this.sidenav.close();
  }

  onOtorisation(event, stepper: MatStepper, drawer: MatDrawer) {
    // console.log(event);
    switch (event) {
      case 'now':
        // console.log('now');
        // console.log(this.headSelectTeller);
        this.initializeWebSocketConnection('vldspv', stepper, drawer);
        this.transacServ.verifyFingerHead(this.headSelectTeller['username'], this.token).subscribe(e => {
          console.log(e);
        })
        this.ngZone.runOutsideAngular(() => this.animationItem.play());
        this.isHeadTeller = false
        break;
      case 'request':
        // console.log('request');
        stepper.next()
        this.isDisplayPrint = false;
        this.isWaitingConfirmation = true;
        this.isRejectConfirmation = false;
        // this.stepDisabledHorizontal = false;
        // this.isCloseDialog = true;
        this.isHeadTeller = false

        this.dataFormHeadValidation.status = 999;

        if (this.dataFormHeadValidation.trntype === 'Tarik Tunai') {
          this.dataFormHeadValidation.trntype = 'trk'
        } else if (this.dataFormHeadValidation.trntype === 'Setor Tunai') {
          this.dataFormHeadValidation.trntype = 'str'
        } else if (this.dataFormHeadValidation.trntype === 'Transaksi Antar Rekening') {
          this.dataFormHeadValidation.trntype = 'tar'
        } else if (this.dataFormHeadValidation.trntype === 'Transaksi Antar Bank') {
          this.dataFormHeadValidation.trntype = 'tab'
        }

        this.dataFormHeadValidation.isRejected = 0
        this.dataFormHeadValidation.isValidated = 0
        this.dataFormHeadValidation.userterminal = JSON.parse(this.ls.get('data')).userterminal;
        let terminalData = this.ls.get('termdata');
        let user = JSON.parse(this.ls.get('data')).userid;

        this.transacServ.sendRemoteValidation(this.dataFormHeadValidation, this.headSelectTeller.userid).subscribe(resp => {
          console.log(resp);
        })

        this.initializeWebSocketConnection2('vldspv' + this.dataFormHeadValidation.transid, stepper, drawer);

        break;
      case 'reject':
        console.log('reject');
        this.isDisplayPrint = false;
        this.isWaitingConfirmation = false;
        this.isRejectConfirmation = true;
        // this.stepDisabledHorizontal = false;
        // this.isCloseDialog = true;
        this.isHeadTeller = false
        this.done()
        stepper.next()
        break;
      default:
        break;
    }

  }

  onFingerVerifyHead(status, stepper: MatStepper, drawer: MatDrawer, type: string) {
    if (type === "onsite") {
      // console.log("run on");
      this.done()
      try {
        this.ngZone.runOutsideAngular(() => this.animationItem.stop());
      } catch (error) {
        console.log("Lottie Error!");
      }

      if (status) {
        setTimeout(() => {
          drawer.toggle()
          setTimeout(() => {
            stepper.next()
            this.isDisplayPrint = true;
            this.isWaitingConfirmation = false;
            this.isRejectConfirmation = false;
            // this.stepDisabledHorizontal = false;
            // this.isCloseDialog = true;
            this.disconnect()
          }, 500)
        }, 1000)
      } else {
        console.log('silahkan coba lagi');
      }
    } else {
      this.isDisplayPrint = true;
      this.isWaitingConfirmation = false;
      this.isRejectConfirmation = false;
      // this.stepDisabledHorizontal = false;
      this.stompClientSocket.disconnect();
    }
  }

  onSelectValueChangeHeadTeller(event) {
    if (event !== null) {
      this.isHeadTeller = true
      this.headSelectTeller = event;
    } else {
      console.log('kosong');
      this.isHeadTeller = false
    }
  }

  configReady(event) {
    // console.log(event);
  }

  sendProcess(dataProsesApi, dataForm, stepper, drawer, value) {
    this.queueServ.processTransactionDataQ(dataForm).subscribe(res => {

      if (res['success']) {
        let traceNo = this.utilityService.leftPadding(res['traceno'].toString(), "0", 17);
        dataProsesApi.wbtcno = this.utilityService.asciiToHexa(traceNo);
        dataProsesApi.wbrfno = this.utilityService.asciiToHexa(res['reffno']);
        dataProsesApi.wbtspr = this.utilityService.asciiToHexa(this.utilityService.getRawDateTime());

        this.queueServ.processTransactionDataQ2(dataProsesApi).subscribe(res => {

          if (res['wbrspc'] === "0000000") {
            // console.log("Success");
          } else {
            alert("Process Transaksi Gagal");
            setTimeout(() => {
              this.isProsses = false;
              this.isError = true;
              this.isBack = true;
            }, 500);
          }

          if (value === "remote") {
            this.onFingerVerifyHead(res, stepper, drawer, "remote");
          } else {
            this.onFingerVerifyHead(res, stepper, drawer, "onsite");
          }

        });
      } else {
        alert('Data gagal proses, silahkan coba lagi')
        setTimeout(() => {
          this.isProsses = false;
          this.isError = true;
          this.isBack = true;
        }, 500)
      }
    });
  }

  onCheckBalance() {
    this.isDisplayPrintSaldo = true;
  }

}
