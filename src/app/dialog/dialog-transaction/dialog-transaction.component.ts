import { Component, OnInit, Inject, ViewChild, Input, NgZone, ElementRef, Renderer2, ViewContainerRef, QueryList, ViewChildren, ComponentFactoryResolver } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatGridTileHeaderCssMatStyler, MatStepper, MatSidenav, MatDrawer, MatHorizontalStepper } from '@angular/material';
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
import { WebsocketService } from 'src/app/services/websocket.service';
import { BannerLoadingComponent } from 'src/app/banner/banner-loading/banner-loading.component';
import { BannerSuccessComponent } from 'src/app/banner/banner-success/banner-success.component';
import { BannerRejectComponent } from 'src/app/banner/banner-reject/banner-reject.component';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.css', './dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {
  private TERMINAL_DATA: any = [];
  private BRANCH_CODE;
  private TERMINAL_ID

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
  // isRejectTeller

  private nameHead: any = [];

  private isHeadTeller: boolean = false;
  private isRejectTeller: boolean = true;
  private isSelectHeadTeller: boolean = true;

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

  @ViewChild('steppers', { static: false }) private stepmom: MatStepper;
  @ViewChild('stepper', { static: false }) private stepson: MatStepper;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('ngOtpInput', { static: true }) ngOtpInputRef: any;
  @ViewChild('steppers', { static: true }) stepMom: MatHorizontalStepper;

  // transaction code 
  setorTunaiCode: string;
  tarikTunaiCode: string;
  transferAntarRekCode: string;
  transferAntarBankCode: string;
  newAccountCode: string;
  informasiSaldoTabunganCode: string;
  informasiSaldoGiroCode: string;

  // transLabel: any = new Array;

  // @ViewChild("viewContainerRef", { read: ViewContainerRef })
  @ViewChildren('viewContainerRef', { read: ViewContainerRef }) containers: QueryList<ViewContainerRef>;
  VCR: ViewContainerRef;



  constructor(private dialogRef: MatDialogRef<DialogTransactionComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private _formBuilder: FormBuilder,
    private queueServ: QueueService, private transacServ: TransactionService, private sanitizer: DomSanitizer, private ngZone: NgZone, private appConfig: AppConfiguration,
    private configuration: ConfigurationService, private listConv: ListingService, private utilityService: UtilityService, private callSocket: WebsocketService,
    private renderer: Renderer2, private resolver: ComponentFactoryResolver) {

    // Get All Data Transaction Form Dashboard
    this.data = data.data;
    // console.log("data length : ", data.data.length);

    // Get Data Terminal
    this.TERMINAL_DATA = JSON.parse(this.ls.get('terminal'))
    this.BRANCH_CODE = this.TERMINAL_DATA.branchCode;
    this.TERMINAL_ID = this.TERMINAL_DATA.terminalID;

    // Get Transaction Type Code
    this.setorTunaiCode = this.configuration.getConfig().typeSetorTunai;
    this.tarikTunaiCode = this.configuration.getConfig().typeTarikTunai;
    this.transferAntarRekCode = this.configuration.getConfig().typeTransferAntarRek;
    this.transferAntarBankCode = this.configuration.getConfig().typeTransferAntarBank;
    this.newAccountCode = this.configuration.getConfig().typeNewAccount;
    this.informasiSaldoGiroCode = this.configuration.getConfig().typeCheckSaldoGiro;
    this.informasiSaldoTabunganCode = this.configuration.getConfig().typeCheckSaldoTabungan;

    // Get Ip Config for socket
    this.serverUrlSocket = this.appConfig.ipSocketServer;

    // ---------------------------------------------------------------------------------
    // Init Data Form
    // ---------------------------------------------------------------------------------
    let forms = new Array;
    for (const key in data.data) {
      if (data.data.hasOwnProperty(key)) {
        const element = data.data[key];
        // console.log(element.trntype);
        this.noQ = element.queueno;
        let changeKey = element.transbuff[0]
        this.transID_for_while = element.transid
        this.status_for_while = element.status

        console.log("changeKey.tp : ", changeKey.tp);

        // Change Data Key
        // switch (changeKey.tp) {
        //   case this.tarikTunaiCode:
        //     this.transLabel.push("Tarik Tunai");
        //     changeKey.tp = 'Tarik Tunai'
        //     break;
        //   case this.setorTunaiCode:
        //     this.transLabel.push("Setor Tunai");
        //     changeKey.tp = 'Setor Tunai'
        //     break;
        //   case this.transferAntarBankCode:
        //     this.transLabel.push("Transfer Antar Bank");
        //     changeKey.tp = 'Transfer Antar Bank'
        //     break;
        //   case this.transferAntarRekCode:
        //     this.transLabel.push("Transfer Antar Rekening");
        //     changeKey.tp = 'Transfer Antar Rekening'
        //     break;
        //   case this.informasiSaldoGiroCode:
        //     this.transLabel.push("Informasi Saldo Giro");
        //     changeKey.tp = 'Informasi Saldo Giro'
        //     break;
        //   case this.informasiSaldoTabunganCode:
        //     this.transLabel.push("Informasi Saldo Tabungan");
        //     changeKey.tp = 'Informasi Saldo Tabungan'
        //     break;
        //   default:
        //     break;
        // }

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

    //  ================================================================================================
    //  Init Dynamic Form
    //  ================================================================================================

    // Init FormArray to FormGroup
    this.formGroup = this._formBuilder.group({
      form: this._formBuilder.array([this.init('')])
    })

    // Add Form per item transaction from DataForm
    for (const key in this.dataForm) {
      if (this.dataForm.hasOwnProperty(key)) {
        const element = this.dataForm[key];
        this.addItem(element.transbuff, element.transid);
      }
    }
    this.form.removeAt(0)

    //  ================================================================================================
    //  Get Data Head Teller or Head CS
    //  ================================================================================================

    // Get Head Teller
    this.transacServ.headTellerList('headteller', this.BRANCH_CODE).subscribe(list => {
      if (list['success']) {
        this.nameHead = list['record']
      }
    })
  }

  // Get Head CS


  //  ================================================================================================
  // Each transaction each formcontrol into one formgroup
  //  ================================================================================================
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

  //  ================================================================================================
  //  Push Formgroup to FormArray
  //  ================================================================================================
  addItem(event, transid) {
    event.TransaksiId = transid;
    this.form = this.formGroup.get('form') as FormArray;
    this.form.push(this.init(event));
  }

  //  ================================================================================================
  //  Function Close Popup Transaction Back to Dashboard
  //  ================================================================================================
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

  //  ================================================================================================
  //  Function Skip to another transaction queue
  //  ================================================================================================
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

  //  ================================================================================================
  //  Process Transaction Queue
  //  ================================================================================================
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


  transactionCancels(i, event, stepper) {
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

  //  ================================================================================================
  //  Process Transaction STEP 1
  //  ================================================================================================
  //  IF PROCESS / Button Process                                                            |   1   |
  //  ------------------------------------------------------------------------------------------------

  transactionProcess(index, step: MatStepper) {

    let data: any = this.form.at(index).value;
    console.log(this.form.at(index).value);

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];

        //  Change Key Name
        switch (key) {
          case 'TransaksiId':
            data.wstran = element;
            delete data.TransaksiId;
            break;
          case 'nm':
            data.wsnomn = element.toString();
            delete data.nm;
            break;
          case 'tn':
            data.wsicas = element;
            delete data.tn;
            break;
          case 'tp':
            data.wstype = element;
            delete data.tp;
            break;
          case 'fr':
            data.wsfrom = element;
            delete data.fr;
            break;
          case 'to':
            data.wstoto = element.toString();
            delete data.to;
            break;
          case 'br':
            data.wsbrta = element;
            delete data.br;
            break;
          case 'bc':
            data.wsbcod = element;
            delete data.bc;
            break;
          case 'id':
            data.wsidid = element;
            delete data.id;
            break;
          default:
            break;
        }
      }
    }

    let transId = data.wstran;
    let dataObj = this.findDataByTransactionId(transId, this.data);
    let payLoad = JSON.stringify(data);
    dataObj.transbuff = JSON.parse(payLoad)
    // let payLoadHex = JSON.parse(JSON.stringify(data.value))
    console.log(data);
    console.log(payLoad);
    console.log(dataObj);

    // Post STEP 1 DATA for Validation true or false
    this.transacServ.requestValidation(dataObj).subscribe(e => {
      // console.log(e);
      if (e['success']) {
        // console.log(e['message']);
        if (e['validate'] === 'true') {
          console.log('harus validasi');
          this.isCloseDialog = !this.isCloseDialog;
          this.stepDisabledHorizontal = true;
          step.next(); // Go To Step 1
        } else {
          console.log('tidak validasi');
          step.next(); // Skip to Step 2
          step.next(); // Go To Step 3
        }
      } else {
        console.log("data tidak berhasil dikirim");
      } // END e['success']
    }) // END transacServ.requestValidation()
  }

  //  ------------------------------------------------------------------------------------------------
  //  ELSE CANCEL / Button Cancel                                                            |   1   |
  //  ------------------------------------------------------------------------------------------------
  transactionCancel(index) {
    let data: any = this.form.at(index).value;
    // console.log(data);
    let arr = new Array;

    let obj: any = new Object();
    obj.transId = data.TransaksiId;
    obj.status = '100';
    arr.push(obj)

    this.queueServ.changeStatusTransactionQ(arr).subscribe(e => {
      console.log(e['successId0']);
      if (e['successId0']) {
        this.form.removeAt(index)
        this.stepmom.reset()
        console.log(this.form.length);
        this.stepDisabledHorizontal = !this.stepDisabledHorizontal;
      } else {
        console.log("data status tidak berhasil diganti");
      }
    })

  }

  //  ================================================================================================
  //  Process Transaction STEP 2
  //  ================================================================================================
  //  IF REJECT / Button Reject                                                              |   2   |
  //  ------------------------------------------------------------------------------------------------
  onReject(index) {
    let data: any = this.form.at(index).value;
    // console.log(data);
    let arr = new Array;

    let obj: any = new Object();
    obj.transId = data.wstran;
    obj.status = '100';
    arr.push(obj)

    this.queueServ.changeStatusTransactionQ(arr).subscribe(e => {
      console.log(e['successId0']);
      if (e['successId0']) {
        this.form.removeAt(index)
        this.stepDisabledHorizontal = false
        console.log(this.form.length);
      } else {
        console.log("data status tidak berhasil diganti");
      }
    })
  }


  //  ------------------------------------------------------------------------------------------------
  //  ELSE IF OTORISATION / Button Otorisation                                               |   2   |
  //  ------------------------------------------------------------------------------------------------
  onOtorisation(index, step: MatStepper) {
    let data: any = this.form.at(index).value;
    this.isHeadTeller = !this.isHeadTeller;
    this.isRejectTeller = !this.isRejectTeller;
    this.isSelectHeadTeller = !this.isSelectHeadTeller;
    // this.teSt.nativeElement.insertAdjacentHTML('');
    // console.log(this.containers);
    this.addComponent('loader')

    // console.log(this.stepMom);

    let transId = data.wstran;
    let dataObj = this.findDataByTransactionId(transId, this.data);
    let payLoad = JSON.stringify(data);
    dataObj.transbuff = payLoad;
    // let payLoadHex = JSON.parse(JSON.stringify(data.value))
    dataObj.isValidated = 0
    console.log(data);
    console.log(payLoad);
    console.log(dataObj);

    this.transacServ.sendRemoteValidation(dataObj, this.headSelectTeller.userid).subscribe(resp => {
      console.log(resp);
      if (resp['success']) {
        console.log(dataObj.transid);
        // this.dynamic.nativeElement.insertAdjacentHTML('<div class="two">two</div>');

        this.callSocket.initSocketHeadTellerConnection(100, 'vldspv', dataObj.transid).then(value => {
          console.log(JSON.parse(value));

          const data = JSON.parse(value)
          if (data['rejected']) {
            dataObj.isValidated = 0;
            dataObj.isRejected = 1;
            console.log(dataObj);
            this.removeComponent()
            this.addComponent('reject')
            this.isProsses = true;
            this.isError = true;
            this.isHeadTeller = false;
            this.stepDisabledHorizontal = true;
          } else {
            dataObj.isValidated = 1;
            dataObj.isRejected = 0;
            console.log(dataObj);
            this.removeComponent()
            // this.addComponent('reject')
            this.isProsses = true;
            this.isSuccess = true;
            this.stompClient.disconnect()
            step.next()
          }
        });

      }
    })
    // let socket: any = this.callSocket.initSocketHeadTellerConnection('vldspv', this.dataFormHeadValidation.transid)
    // console.log(socket);

    // this.initializeWebSocketConnection2('vldspv' + this.dataFormHeadValidation.transid, step)
  }

  //  ------------------------------------------------------------------------------------------------
  //  Add Component                                                                          |   2   |
  //  ------------------------------------------------------------------------------------------------
  addComponent(event) {

    switch (event) {
      case 'loader':
        this.VCR = this.containers.first;
        const factoryLoad = this.resolver.resolveComponentFactory(BannerLoadingComponent);
        this.VCR.createComponent(factoryLoad);
        // const containerLoader = this.containers.first;
        // const factoryLoader = this.resolver.resolveComponentFactory(BannerLoadingComponent);
        // containerLoader.createComponent(factoryLoader);
        break;
      case 'success':
        this.VCR = this.containers.first;
        const factorySuccess = this.resolver.resolveComponentFactory(BannerSuccessComponent);
        this.VCR.createComponent(factorySuccess);
        // const containerSuccess = this.containers.first;
        // const factorySuccess = this.resolver.resolveComponentFactory(BannerSuccessComponent);
        // containerSuccess.createComponent(factorySuccess);
        break;
      case 'reject':
        this.VCR = this.containers.first;
        const factoryReject = this.resolver.resolveComponentFactory(BannerRejectComponent);
        this.VCR.createComponent(factoryReject);
        // const containerReject = this.containers.first;
        // const factoryReject = this.resolver.resolveComponentFactory(BannerRejectComponent);
        // containerReject.createComponent(factoryReject);
        break;
      default:
        break;
    }
  }

  removeComponent() {
    console.log(this.containers);
    this.VCR.remove();
  }

  btnOK(event) {
    this.onReject(event)
    this.stepDisabledHorizontal = false
    this.stompClient.disconnect()
  }

  refresh() {
    // this.isHeadTeller = false;
    // this.isRejectTeller = true;
    // this.isSelectHeadTeller = true;
  }


  //  ------------------------------------------------------------------------------------------------
  //  IF OVERIDE / Button Override                                                           |   2   |
  //  ------------------------------------------------------------------------------------------------
  onOverride(index, step) {
    let data: any = this.form.at(index).value;
    this.isHeadTeller = !this.isHeadTeller;
    this.isRejectTeller = !this.isRejectTeller;
    this.isSelectHeadTeller = !this.isSelectHeadTeller;
    // this.teSt.nativeElement.insertAdjacentHTML('');
    // console.log(this.containers)
    // console.log(this.stepMom);

    let transId = data.wstran;
    let dataObj = this.findDataByTransactionId(transId, this.data);
    let payLoad = JSON.stringify(data);
    dataObj.transbuff = payLoad;
    // let payLoadHex = JSON.parse(JSON.stringify(data.value))
    dataObj.isValidated = 0
    console.log(data);
    console.log(payLoad);
    console.log(dataObj);


    this.transacServ.verifyFingerHead(this.headSelectTeller['username'], this.token).subscribe(e => {
      console.log(e);
      if (e['success']) {
        this.callSocket.initSocketHeadTellerConnectionOver('vldspv').then(value => {
          console.log(JSON.parse(value));
          const data = JSON.parse(value)
          console.log(data);

          if (data.success) {
            console.log("data cocok");
            dataObj.isValidated = 1;
            dataObj.isRejected = 0;
            console.log(dataObj);
            step.next()
            console.log(step);
            this.stompClient.disconnect()
          } else {
            console.log("data tidak cocok");
          }
        })
      }
    })
  }



  //  ------------------------------------------------------------------------------------------------
  //  Find data object with index                                                            |   X   |
  //  ------------------------------------------------------------------------------------------------
  findDataByTransactionId(key, object) {
    for (let index = 0; index < object.length; index++) {
      const el = object[index];
      if (object[index].transid === key) {
        return object[index]
      }
    }
  }

  //  ------------------------------------------------------------------------------------------------
  //  Remove data object with index                                                           |   X   |
  //  ------------------------------------------------------------------------------------------------=
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
                this.queueServ.refreshQ(this.BRANCH_CODE).subscribe()
                localStorage.removeItem('skip')
                this.dialogRef.close();
              } else {
                this.form.reset()
                this.formGroup.reset()
                this.queueServ.refreshQ(this.BRANCH_CODE).subscribe()
                this.dialogRef.close();
              }

            })
          } else {
            // console.log('localstorage null');
            this.form.reset()
            this.formGroup.reset()
            this.queueServ.refreshQ(this.BRANCH_CODE).subscribe()
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
                this.queueServ.refreshQ(this.BRANCH_CODE).subscribe()
                localStorage.removeItem('skip')
                this.dialogRef.close();
              } else {
                this.form.reset()
                this.formGroup.reset()
                this.queueServ.refreshQ(this.BRANCH_CODE).subscribe()
                this.dialogRef.close();
              }

            })
          } else {
            this.form.reset()
            this.formGroup.reset()
            this.queueServ.refreshQ(this.BRANCH_CODE).subscribe()
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
            this.initializeWebSocketConnection('vldnas', stepper)
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
        this.transacServ.headTellerList('headteller', this.BRANCH_CODE).subscribe(list => {
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

            // if (res['wbrspc'] === "0000000") {

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
            // } else {
            //   alert("Process Transaksi Gagal")
            // }
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

  initializeWebSocketConnection(socket, stepper: MatStepper) {

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
              that.initializeWebSocketConnection(socket, stepper);
            }, 1000);

          });
        }, err => {

          setTimeout(() => {
            that.initializeWebSocketConnection(socket, stepper);
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
                console.log("send data : ", that.dataFormHeadValidation);

                that.dataFormHeadValidation.trntype = "000001";

                that.transacServ.sendRemoteValidation(that.dataFormHeadValidation, that.headSelectTeller.userid).subscribe(resp => {
                  // console.log("response : ", resp);
                  if (resp['success']) {
                    // that.onFingerVerifyHead(parse, stepper, drawer, "onsite");
                    that.sendProcess(that.dataFormActual, that.dataFormHeadValidation, stepper, "onsite");
                  } else {
                    // alert("validasi gagal");
                    that.sendProcess(that.dataFormActual, that.dataFormHeadValidation, stepper, "onsite");
                  }
                });
              }
            }

          }, () => {
            // that.dialog.errorDialog("Error", "Koneksi Terputus");
            // console.log("koneksi terputus");
            // console.log("Koneksi Ulang");
            setTimeout(() => {
              that.initializeWebSocketConnection(socket, stepper);
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

  initializeWebSocketConnection2(socket, stepper: MatStepper) {

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
            that.sendProcess(that.dataFormActual, that.dataFormHeadValidation, stepper, "remote");
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


  //  ================================================================================================

  // Function Otorisasi param INDEX, STEPPER PENYEDIA SELANJUTNYAm ctrl Sebagai Transaksi ID

  //  ================================================================================================
  // onOtorisation(index, stepper: MatStepper, ctrl, btnType) {
  //   // console.log(index, stepper, ctrl.TransaksiId.value);
  //   console.log(this.form.at(index));
  //   switch (btnType) {
  //     case "001":
  //       console.log("REJECT", this.form.at(index));
  //       this.form.removeAt(index) // Remove Form By Index

  //       for (const key in this.form.controls) {
  //         if (this.form.controls.hasOwnProperty(key)) {
  //           const element = this.form.controls[key];

  //           // Double check the data that was just deleted by index
  //           if (element.get('TransaksiId').value == ctrl.TransaksiId.value) {
  //             console.log("Data Belum di Hapus");
  //           } else {
  //             console.log("Data Berhasil di Hapus");
  //           }
  //         }
  //       } // End

  //       // console.log("=>", this.form.length)
  //       // Last Index will be trigger to SKIP function
  //       if (this.form.length < 1) {
  //         this.skipQ();
  //       }
  //       break;
  //     case "002":
  //       console.log("OTORISASI", this.form.at(index));
  //       break;
  //     case "003":
  //       console.log("OVERRIDE", this.form.at(index));
  //       break;

  //   }


  // switch (event) {
  //   case 'now':
  //     // console.log('now');
  //     // console.log(this.headSelectTeller);
  //     this.initializeWebSocketConnection('vldspv', stepper, drawer);
  //     this.transacServ.verifyFingerHead(this.headSelectTeller['username'], this.token).subscribe(e => {
  //       console.log(e);
  //     })
  //     this.ngZone.runOutsideAngular(() => this.animationItem.play());
  //     this.isHeadTeller = false
  //     break;
  //   case 'request':
  //     // console.log('request');
  //     stepper.next()
  //     this.isDisplayPrint = false;
  //     this.isWaitingConfirmation = true;
  //     this.isRejectConfirmation = false;
  //     // this.stepDisabledHorizontal = false;
  //     // this.isCloseDialog = true;
  //     this.isHeadTeller = false

  //     this.dataFormHeadValidation.status = 999;

  //     if (this.dataFormHeadValidation.trntype === 'Tarik Tunai') {
  //       this.dataFormHeadValidation.trntype = 'trk'
  //     } else if (this.dataFormHeadValidation.trntype === 'Setor Tunai') {
  //       this.dataFormHeadValidation.trntype = 'str'
  //     } else if (this.dataFormHeadValidation.trntype === 'Transaksi Antar Rekening') {
  //       this.dataFormHeadValidation.trntype = 'tar'
  //     } else if (this.dataFormHeadValidation.trntype === 'Transaksi Antar Bank') {
  //       this.dataFormHeadValidation.trntype = 'tab'
  //     }

  //     this.dataFormHeadValidation.trntype = "0000001  ";

  //     this.dataFormHeadValidation.isRejected = 0
  //     this.dataFormHeadValidation.isValidated = 0
  //     this.dataFormHeadValidation.userterminal = JSON.parse(this.ls.get('data')).userterminal;
  //     let terminalData = this.ls.get('termdata');
  //     let user = JSON.parse(this.ls.get('data')).userid;

  //     this.transacServ.sendRemoteValidation(this.dataFormHeadValidation, this.headSelectTeller.userid).subscribe(resp => {
  //       console.log(resp);
  //     })

  //     this.initializeWebSocketConnection2('vldspv' + this.dataFormHeadValidation.transid, stepper, drawer);

  //     break;
  //   case 'reject':
  //     console.log('reject');
  //     this.isDisplayPrint = false;
  //     this.isWaitingConfirmation = false;
  //     this.isRejectConfirmation = true;
  //     // this.stepDisabledHorizontal = false;
  //     // this.isCloseDialog = true;
  //     this.isHeadTeller = false
  //     this.done()
  //     stepper.next()
  //     break;
  //   default:
  //     break;
  // }

  // }

  onFingerVerifyHead(status, stepper: MatStepper, type: string) {
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
          // drawer.toggle()
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

  sendProcess(dataProsesApi, dataForm, stepper, value) {
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
            this.onFingerVerifyHead(res, stepper, "remote");
          } else {
            this.onFingerVerifyHead(res, stepper, "onsite");
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
