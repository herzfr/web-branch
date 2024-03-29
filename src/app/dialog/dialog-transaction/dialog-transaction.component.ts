import { Component, OnInit, Inject, ViewChild, Input, NgZone, ElementRef, Renderer2, ViewContainerRef, QueryList, ViewChildren, ComponentFactoryResolver } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatGridTileHeaderCssMatStyler, MatStepper, MatSidenav, MatDrawer, MatHorizontalStepper, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { DomSanitizer } from '@angular/platform-browser';

// Services
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ListingService } from 'src/app/services/listing.service';
import { UtilityService } from 'src/app/services/utility.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { QueueService } from 'src/app/services/queue.service';
import { TransactionService } from 'src/app/services/transaction.service';

// Module
import * as securels from 'secure-ls';

// Config
import { AppConfiguration } from 'src/app/models/app.configuration';

// Model
import { TransactionModel } from 'src/app/models/transaction-model';
import { FotonasabahComponent } from '../fotonasabah/fotonasabah.component';
import { NasabahsignComponent } from '../nasabahsign/nasabahsign.component';
import { SetortunaiService } from 'src/app/services/transservices/setortunai.service';
import { DialogPaymentComponent } from '../dialog-payment/dialog-payment.component';
import { TransferonusService } from 'src/app/services/transservices/transferonus.service';
import { Observable } from 'rxjs';
import { TariktunaiService } from 'src/app/services/transservices/tariktunai.service';

// Declare
declare var $: any;

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.css', './dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {
  private TERMINAL_DATA: any = [];
  private USERDATA: any = [];
  private BRANCH_CODE;
  private TERMINAL_ID;

  private USER_ID;

  // All Data OBJ
  private data: any;
  private dataForm: any;
  private noQ: any;
  private dataObj: any = [];
  // private isCust: any;

  // FORM
  private form: FormArray;
  private formGroup: FormGroup;
  private dataSuccess = new Array;
  // private dataSuccess: Observable<Array<any>>

  // Model
  transactionModel: TransactionModel = new TransactionModel();

  private isLinear = true;
  private isBack = false;
  private isNext = false;
  private isPreview = true;

  // Keterangan / Info status Otorisasi HeadTeller
  private isWaiting = false;
  private isRejected = false;
  private isApproved = false;

  // Main Button
  private isCancelBtn: boolean = true;
  private isSkipBtn: boolean = true;
  private isDoneBtn: boolean = false;
  private isCloseDialog: boolean = true;

  // data Status
  private transID_for_while: string;
  private status_for_while: number;

  // Mat Step Operator
  private stepDisabled: boolean = true;
  private stepDisabledHorizontal: boolean = false;

  // Module / Config Variable
  // private secureLs = new SecureLS({ encodingType: 'aes' });
  private ls = new securels({ encodingType: 'aes' });
  private token = this.ls.get('token')


  private reffNo;
  private transBuffReply: any;
  private currDataType;

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

  // Data nameHead
  private nameHead: any = [];

  // Head Teller Binding
  private isHeadTeller: boolean = false;
  private isRejectTeller: boolean = true;
  private isSelectHeadTeller: boolean = true;

  // Data Saldo
  private saldoData: any;


  // Otorisasi Head Teller Lottie
  private options: AnimationOptions = {
    path: '/assets/lottie/fingerprint.json'
  };
  private optionWaiting: AnimationOptions = {
    path: '/assets/lottie/loading-verify.json'
  };
  private optionReject: AnimationOptions = {
    path: '/assets/lottie/reject.json'
  };

  //  Default Pic Var
  private base64Image = 'assets/png/avatar.png';
  private base64Sign = 'assets/png/blankimage.png';
  // private base64Sign = '';
  private NAME_CUST = '';
  private imageID;

  // Server Address
  private serverUrl = 'http://localhost:1111/socket';
  private serverUrlSocket;
  private stompClient;
  private stompClientSocket;

  private headSelectTeller: any;
  private animationItem: AnimationItem;

  // ViewChild
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
  paymentCode: string;

  // Data Select Payment
  private menuPayment: any;
  private subMenuPay: any = [];


  constructor(private dialogRef: MatDialogRef<DialogTransactionComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private _formBuilder: FormBuilder,
    private queueServ: QueueService, private transacServ: TransactionService, private sanitizer: DomSanitizer, private ngZone: NgZone, private appConfig: AppConfiguration,
    private configuration: ConfigurationService, private listConv: ListingService, private utilityService: UtilityService, private callSocket: WebsocketService,
    private renderer: Renderer2, private setorTunaiService: SetortunaiService, private transferOnUsService: TransferonusService, private tarikTunaiService: TariktunaiService) {

    // Get All Data Transaction Form Dashboard
    this.data = data.data;
    console.log(this.data);

    // console.log("data length : ", data.data.length);

    // Get Data Terminal
    this.TERMINAL_DATA = JSON.parse(this.ls.get('terminal'))
    this.BRANCH_CODE = this.TERMINAL_DATA.branchCode;
    this.TERMINAL_ID = this.TERMINAL_DATA.terminalID;

    // Get Data User
    this.USERDATA = JSON.parse(this.ls.get('data'))
    this.USER_ID = this.USERDATA.userid;

    // console.log(this.ls.get('terminal'));
    // console.log(this.ls.get('termdata'));
    // console.log(this.ls.get('data'));



    // Get Transaction Type Code
    this.setorTunaiCode = this.configuration.getConfig().typeSetorTunai;
    this.tarikTunaiCode = this.configuration.getConfig().typeTarikTunai;
    this.transferAntarRekCode = this.configuration.getConfig().typeTransferAntarRek;
    this.transferAntarBankCode = this.configuration.getConfig().typeTransferAntarBank;
    this.newAccountCode = this.configuration.getConfig().typeNewAccount;
    this.informasiSaldoGiroCode = this.configuration.getConfig().typeCheckSaldoGiro;
    this.informasiSaldoTabunganCode = this.configuration.getConfig().typeCheckSaldoTabungan;
    this.paymentCode = this.configuration.getConfig().typePayment;


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

        if (element.trntype === this.paymentCode) {
          console.log('ada bro');
          this.transacServ.getDataPayment().subscribe(res => {
            console.log(res);
            this.menuPayment = res;
            this.trigger()
          })
        }

        // console.log(changeKey.Tunai);
        let dataForm = { "transid": element.transid, "transbuff": element.transbuff[0], "trntype": element.trntype };

        // console.log(element.transbuff[0].py);

        forms.push(dataForm)
      }
    }
    this.dataForm = forms;
    // console.log(this.dataForm);
    // console.log(this.subMenuPay);
  }

  ngOnInit() {
    // this.getDateTime();

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

  //  ================================================================================================
  //  Process Transaction STEP 1
  //  ================================================================================================
  //  IF Payment Function Trigger                                                            |   1   |
  //  ------------------------------------------------------------------------------------------------

  trigger() {
    console.log("trigger step one : ");

    // console.log(this.stepmom.selectedIndex);
    // console.log(this.form.at(this.stepmom.selectedIndex).get('py').value);
    // console.log(this.form.at(this.stepmom.selectedIndex).get('tp').value);

    if (this.form.at(this.stepmom.selectedIndex).get('tp').value === this.paymentCode) {
      switch (this.form.at(this.stepmom.selectedIndex).get('tp').value) {
        case this.paymentCode:
          this.onChangePayment(this.form.at(this.stepmom.selectedIndex).get('py').value, this.stepmom.selectedIndex)
          break;
        default: break;
      }
    } else {
      console.log("no payment");
    }

  }


  // getDataSuccess(event) {
  //   console.log(event);
  //   let data = this.dataSuccess.find(x => x.code === event);
  //   console.log(data);
  //   return data;
  // }

  //  ------------------------------------------------------------------------------------------------
  //  IF Payment Function                                                                     |   1   |
  //  ------------------------------------------------------------------------------------------------
  onChangePayment(event, index) {
    this.transacServ.getDataSubPayment(event).subscribe(res => {
      this.subMenuPay = res;
      // console.log(this.subMenuPay.length);
      if (this.subMenuPay.length > 0) {
        this.form.at(index).get('sp').enable()
        // console.log("ada");
        // console.log(this.form.at(index).get('sp').value);
      } else {
        this.form.at(index).get('sp').setValue("0000")
        this.form.at(index).get('sp').disable()
        // console.log("gak ada");
        // console.log(this.form.at(index).get('sp').value);
      }
    })

    // console.log(event);
    // console.log(this.form.at(index).value);
  }

  //  ------------------------------------------------------------------------------------------------
  //  IF PROCESS / Button Process                                                            |   1   |
  //  ------------------------------------------------------------------------------------------------

  transactionProcess(index, step: MatStepper) {

    let data: any = this.form.at(index).value;
    console.log(this.form.at(index).value);

    // console.log(data.tp);
    if (data.tp === this.paymentCode) {

      let obj: any = new Object();
      obj.payCode = data.py;
      obj.payDetail = data.sp ? data.sp : "0000";
      obj.billId = data.ib;
      obj.amount = data.nm ? data.nm.toString() : "";
      console.log(obj);

      this.transacServ.retrieveDataPayment(obj).subscribe(res => {
        // console.log(res);
        let response = res;
        if (res['status']) {
          console.log(res);
          const dialogConfig = new MatDialogConfig();
          dialogConfig.backdropClass = 'backdropBackground';
          dialogConfig.disableClose = true;
          dialogConfig.width = '1000px';
          dialogConfig.data = res;

          this.dialog.open(DialogPaymentComponent, dialogConfig).afterClosed().subscribe(status => {
            // console.log(status);
            if (status) {
              console.log(response);
              this.onProcessData(index, step, response)
            } else {
              console.log("batal");
              // this.onReject(index)
            }
          });

          this.dialog.open
        } else {
          alert('Data Error')
        }
      })
    } else {
      this.onProcessData(index, step, null)
    }
  }

  //  ------------------------------------------------------------------------------------------------
  //  ON PROCESS DATA                                                                         |   1   |
  //  ------------------------------------------------------------------------------------------------
  onProcessData(index, step: MatStepper, response) {
    console.log(this.form.at(index).value);
    let data: any = this.form.at(index).value;
    console.log(this.form.at(index).value);

    for (const key in this.form.at(index).value) {
      if (this.form.at(index).value.hasOwnProperty(key)) {
        const element = data[key];

        console.log("proses button element :", element);
        console.log(key);
        console.log(element);

        //  Change Key Name
        switch (key) {
          case 'TransaksiId':
            data.wstran = element;
            delete data.TransaksiId;
            break;
          case 'nm':
            if (response === null) {
              data.wsnomn = element.toString();
              delete data.nm;
            } else {
              data.wsnomn = response.amount;
              delete data.nm;
            }
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
          case 'ib':
            data.wsbilid = element;
            delete data.ib;
            break;
          case 'py':
            data.wspayc = data.py + data.sp;
            delete data.py;
            // delete data.sp;
            break;
          case 'sp':
            delete data.sp;
            // delete data.sp;
            break;
          default:
            break;
        }

        if (data.tp === this.paymentCode) {
          data.wsnomn = response.amount;
        }

      }
    }

    // console.log(data);

    let transId = data.wstran;
    let dataObj = this.findDataByTransactionId(transId, this.data);
    // console.log(dataObj);

    let payLoad = JSON.stringify(data);
    dataObj.transbuff = JSON.parse(payLoad)
    // let payLoadHex = JSON.parse(JSON.stringify(data.value))

    console.log("data object : ", dataObj);

    this.currDataType = dataObj.trntype;

    switch (dataObj.trntype) {
      case this.setorTunaiCode:
        this.setorTunaiService.processInquiry(dataObj).then(
          res => {
            this.reffNo = res['traceNo'];
            this.transBuffReply = res['wbtrbf']
            this.NAME_CUST = this.transBuffReply.wstonm;
            return res;
          }
        );
        break;
      case this.transferAntarRekCode:
        console.log("type transfer on us", dataObj);
        this.transferOnUsService.processInquiry(dataObj)
          .then(
            res => {
              console.log("respons balikan as : ", res);
              this.transBuffReply = res['wbtrbf']
              this.NAME_CUST = this.transBuffReply.wstonm;
              // this.reffNo = res['traceNo'];
            }
          );
        break;
      default:
        break;
    }


    // get process validation / inquiry 
    // Post STEP 1 DATA for Validation true or false

    try {
      dataObj.transbuff = JSON.parse(dataObj.transbuff);
    } catch (error) {
      console.log("tidak perlu parse");
    }   //set data transbufff to objek 

    console.log("data validation : ", dataObj);

    this.transacServ.requestValidation(dataObj).subscribe(e => {
      // console.log(e);
      if (e['success']) {
        // console.log(e['message']);
        if (e['validate'] === 'true') {
          console.log('harus validasi');
          // this.isCloseDialog = false;
          this.stepDisabledHorizontal = true;
          this.isCancelBtn = false;
          this.isSkipBtn = false;
          this.updateDataObj(dataObj)
          step.next(); // Go To Step 1
        } else {
          console.log('tidak validasi');
          console.log('type : ', data);

          if (data.wstype === this.setorTunaiCode) {
            console.log("data setor tunai");

            this.cardReader(data.wstoto)
          } else {
            this.cardReader(data.wsfrom);
          }
          // this.isCloseDialog = false;
          this.stepDisabledHorizontal = true;
          this.isCancelBtn = false;
          this.isSkipBtn = false;
          this.updateDataObj(dataObj)
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
        this.done()
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
        this.done()
      } else {
        console.log("data status tidak berhasil diganti");
      }
    })
  }


  //  ------------------------------------------------------------------------------------------------
  //  ELSE IF OTORISATION / Button Otorisation                                               |   2   |
  //  ------------------------------------------------------------------------------------------------
  onOtorisation(index, step: MatStepper) {
    let dataForm: any = this.form.at(index).value;
    this.isHeadTeller = false;
    this.isRejectTeller = false;
    this.isSelectHeadTeller = false;
    this.isWaiting = true;
    this.isPreview = false;
    // this.teSt.nativeElement.insertAdjacentHTML('');
    // console.log(this.containers);

    // console.log(this.stepMom);

    let transId = dataForm.wstran;
    let dataObj = this.findDataByTransactionId(transId, this.data);
    let payLoad = JSON.stringify(dataForm);
    dataObj.transbuff = payLoad;
    // let payLoadHex = JSON.parse(JSON.stringify(data.value))
    dataObj.isValidated = 0

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
            // this.isProsses = true;
            // this.isError = true;
            this.isWaiting = false;
            this.isRejected = true
            this.isHeadTeller = false;
            this.stepDisabledHorizontal = true;
          } else {
            dataObj.isValidated = 1;
            dataObj.isRejected = 0;
            console.log(dataObj);
            this.updateDataObj(dataObj)
            this.cardReader(dataForm.wsfrom)
            this.isWaiting = false;
            this.isApproved = true;
            this.callSocket.disconnectSocket();
            this.stepDisabledHorizontal = true;
            // step.next()
          }
        });

      }
    })
    // let socket: any = this.callSocket.initSocketHeadTellerConnection('vldspv', this.dataFormHeadValidation.transid)
    // console.log(socket);

    // this.initializeWebSocketConnection2('vldspv' + this.dataFormHeadValidation.transid, step)
  }

  //  ------------------------------------------------------------------------------------------------
  //  Btn OK Reject                                                                           |   2   |
  //  ------------------------------------------------------------------------------------------------
  btnOK(event) {
    this.onReject(event)
    this.refresh();
    this.callSocket.disconnectSocket();
  }

  //  ------------------------------------------------------------------------------------------------
  //  IF OVERIDE / Button Override                                                           |   2   |
  //  ------------------------------------------------------------------------------------------------
  onOverride(index, step) {
    let dataForm: any = this.form.at(index).value;
    this.isHeadTeller = false;
    this.isRejectTeller = false;
    this.isSelectHeadTeller = false;
    // this.teSt.nativeElement.insertAdjacentHTML('');
    // console.log(this.containers)
    // console.log(this.stepMom);

    let transId = dataForm.wstran;
    let dataObj = this.findDataByTransactionId(transId, this.data);
    let payLoad = JSON.stringify(dataForm);
    dataObj.transbuff = payLoad;
    // let payLoadHex = JSON.parse(JSON.stringify(data.value))
    dataObj.isValidated = 0

    this.transacServ.verifyFingerHead(this.headSelectTeller['username'], this.token).subscribe(e => {
      // console.log(e);
      if (e['success']) {
        this.callSocket.initSocketHeadTellerConnectionOver('vldspv').then(value => {
          // console.log(JSON.parse(value));
          const data = JSON.parse(value)
          // console.log(data);

          if (data.success) {
            // console.log("data cocok");
            dataObj.isValidated = 1;
            dataObj.isRejected = 0;
            // console.log(dataObj);
            this.cardReader(dataForm.wsfrom)
            this.updateDataObj(dataObj)
            $('#card-swap').addClass('blink')
            this.callSocket.disconnectSocket();
            step.next()

          } else {
            console.log("data tidak cocok");
          }
        })
      }
    })
  }



  //  ------------------------------------------------------------------------------------------------
  //  Update Object                                                                          |   x   |
  //  ------------------------------------------------------------------------------------------------
  updateDataObj(objc) {
    // console.log(objc);
    const targetIdx = this.data.map(item => item.transid).indexOf(objc.transid);
    this.data[targetIdx] = objc;
    // console.log(targetIdx);
    // console.log(this.data);
  }



  //  ------------------------------------------------------------------------------------------------
  //  Change Key Object                                                                      |   x   |
  //  ------------------------------------------------------------------------------------------------
  converDataKey(dataObj, dataForm) {
    console.log(dataForm);
    for (const key in dataForm) {
      if (dataForm.hasOwnProperty(key)) {
        const element = dataForm[key];
        console.log(element);
        console.log(key);
        switch (key) {
          case 'wsnomn':
            dataForm[key] = this.utilityService.asciiToHexa(this.utilityService.leftPadding(element, "0", 17));
            break;
          default:
            dataForm[key] = this.utilityService.asciiToHexa(element ? element : "");
            break;
        }
      }
    }

    for (const key in dataObj) {
      if (dataObj.hasOwnProperty(key)) {
        const element = dataObj[key];
        switch (key) {
          case 'queuecode':
            if (element === 'TELLER') {
              dataObj[key] = this.configuration.getConfig().ISTL;
            } else {
              dataObj[key] = this.configuration.getConfig().ISCS;
            }
            break;
          case 'queuedate':
            let date: string = element;
            dataObj[key] = date.replace(/[-]/g, "")
            // console.log(date.replace(/[-]/g, ""));
            break;
          default:
            dataObj[key] = element;
            break;

        }
      }
    }

    // wstype // tipe
    // wsbcod // kode bank
    // wsbrta // berita
    // wsfrom // dari
    // wstoto // ke
    // wspayc // payment code
    // wsblid // billing id
    // wsblclr // clear 


    // wbicsh // is cash or not
    // wbicus // is customer or nasabah


    // Date Time Process
    let processTime = new Date().getTime();

    console.log(dataObj);

    this.transactionModel.wbtmsg = this.utilityService.asciiToHexa("0100");
    this.transactionModel.wbproc = this.utilityService.asciiToHexa("900000");
    this.transactionModel.wbtrid = this.utilityService.asciiToHexa(dataObj.transid);
    this.transactionModel.wbbrcd = this.utilityService.asciiToHexa(dataObj.branchcode);
    this.transactionModel.wbfgid = this.utilityService.asciiToHexa(dataObj.userid ? dataObj.userid : "");
    this.transactionModel.wbscid = "";
    this.transactionModel.wbicsh = "";
    this.transactionModel.wbicus = this.utilityService.asciiToHexa(this.utilityService.leftPadding(dataObj.iscustomer.toString(), "0", 3));
    this.transactionModel.wbqucd = this.utilityService.asciiToHexa(dataObj.queuecode);
    this.transactionModel.wbqudt = this.utilityService.asciiToHexa(dataObj.queuedate);
    this.transactionModel.wbrfno = "";
    this.transactionModel.wbstat = this.utilityService.asciiToHexa("100");
    this.transactionModel.wbtmid = this.utilityService.asciiToHexa(dataObj.terminalid);
    this.transactionModel.wbtsen = this.utilityService.asciiToHexa(this.utilityService.convertMilisToDateTime(dataObj.timestampentry));
    this.transactionModel.wbtspr = this.utilityService.asciiToHexa(processTime.toString());
    this.transactionModel.wbtcno = "";
    this.transactionModel.wbtrbf = dataForm;
    this.transactionModel.wbtrty = this.utilityService.asciiToHexa(dataObj.trntype);
    this.transactionModel.wbusid = this.utilityService.asciiToHexa(this.USER_ID);
    this.transactionModel.wbustm = this.utilityService.asciiToHexa(dataObj.userterminal ? dataObj.userterminal : "");
    this.transactionModel.wbstop = this.utilityService.asciiToHexa("END");

    console.log(this.transactionModel);

    return this.transactionModel;
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


  //  ================================================================================================
  //  Process Transaction STEP 3
  //  ================================================================================================
  //  SWAP CARD / INIT CARD                                                                  |   3   |
  //  ------------------------------------------------------------------------------------------------

  onSwapCard() {
    // console.log(this.cardNum);
    $('#card-swap').removeClass('blink')
    if (this.cardNum !== null) {
      this.isInputPin = true
      this.isCardNumber = true
    }
  }

  //  ------------------------------------------------------------------------------------------------
  //  OTP PIN CARD                                                                           |   3   |
  //  ------------------------------------------------------------------------------------------------
  onOtpChange(event: any, step: MatStepper, index) {

    // Check PIN 
    if (event.length == 6) {
      $('.otp-input').blur();
      $('.otp-input').prop('readonly', true);

      this.transacServ.verifyCard(this.cardNum, event).subscribe(res => {

        console.log("verify card : ", res);

        if (res['success']) {
          this.isScanFinger = true;
          $('#scan-finger').addClass('blink')
          this.pinMessage = 'Pin Sukses'
          this.isPinMessageSuccess = true
          this.isPinMessageError = false


          this.transacServ.getInfoCardPerson(res['record']).subscribe(e => {
            // console.log(e);
            console.log("data type :", this.currDataType);

            if (this.currDataType == this.setorTunaiCode || this.currDataType == this.transferAntarRekCode) {
              console.log("transfer antar rek and setor tunai");
            } else {
              console.log("bukan setor dll ");
              this.NAME_CUST = e['name']
            }

            this.base64Image = 'data:image/png;base64,' + e['imagepict']
            this.base64Sign = 'data:image/png;base64,' + e['imagesign']

            this.imageID = e['imageid']
            this.images64()
            this.sign64()

            // this.transacServ.verifyFingerCust(e['imageid'], this.token).subscribe(eres => {
            //   console.log(eres);
            // })

            this.callFingerVerify()
            this.callSocket.asyncMethod('vldnas').then(value => {
              console.log(value);
            })

            // this.callSocket.initSocketCustomer('vldnas').then(value => {
            this.callSocket.asyncMethod('vldnas').then(value => {

              const res = JSON.parse(value.toString())

              console.log(res);

              if (res['success']) {

                this.fingerMessage = 'Finger Valid'
                this.isFingerSuccess = true
                this.isFingerError = false
                $('#scan-finger').removeClass('blink')

                if (this.stepmom.selectedIndex === index) {
                  let dataForm: any;

                  try {
                    dataForm = JSON.parse(this.data[index].transbuff);
                  } catch (error) {
                    dataForm = this.data[index].transbuff;
                  }

                  // let dataForm: any = this.form.at(index).value;
                  // let dataForm: any = JSON.parse(this.data[index].transbuff);
                  console.log(this.data[index].transbuff);

                  let transId = dataForm.wstran;
                  let dataObj = this.findDataByTransactionId(transId, this.data);

                  const dataProcessApi = this.converDataKey(dataObj, dataForm)
                  console.log(dataProcessApi);

                  console.log("data type : ", dataObj.trntype);



                  if (dataObj.trntype == this.setorTunaiCode) {
                    console.log("data setor  tunai ");

                    dataObj.reffno = this.reffNo;
                    dataObj.wbtrbf = this.transBuffReply;

                    let dataConfirm = new Promise((resolve, reject) => {
                      this.setorTunaiService.prosesPosting(dataObj)
                        .then(response => {
                          console.log("balikan response  as : ", response);


                          if (response['success']) {
                            // this.dataSuccess.push(res)
                            // console.log(this.dataSuccess);
                            response['transid'] = dataObj.transid;

                            resolve(response)

                            this.isDisplayPrint = true;
                            this.done()
                            step.next()

                          }

                        });
                    });

                    dataConfirm.then(callback => {
                      // console.log(callback);
                      this.dataSuccess.push(callback)
                      console.log(this.dataSuccess);

                    });

                  } else if (dataObj.trntype == this.transferAntarRekCode) {
                    console.log("data transfer on us ", dataObj);
                    console.log("data transbuf as : ", this.transBuffReply);


                    dataObj.reffno = this.reffNo;
                    dataObj.wbtrbf = this.transBuffReply;

                    let dataConfirm = new Promise((resolve, reject) => {
                      this.transferOnUsService.prosesPosting(dataObj).then(response => {
                        console.log("balikan reponse as : ", response);

                        if (response['success']) {
                          // this.dataSuccess.push(res)
                          // console.log(this.dataSuccess);
                          response['transid'] = dataObj.transid;

                          resolve(response)

                          this.isDisplayPrint = true;
                          this.done()
                          step.next()

                        }

                      })
                    })

                    dataConfirm.then(callback => {
                      // console.log(callback);
                      this.dataSuccess.push(callback)
                      console.log(this.dataSuccess);

                    });
                  }

                  // } else if (dataObj.trntype == this.tarikTunaiCode) {
                  //   console.log("data tarik tunai ");

                  //   this.tarikTunaiService.setorTunaiProses(dataProcessApi).subscribe(res => {
                  //     console.log("res", res);
                  //     this.isDisplayPrint = true;
                  //     this.done()
                  //     step.next()
                  //   });

                  // }
                  else {

                    let dataConfirm = new Promise((resolve, reject) => {

                      this.queueServ.processTransactionDataQ2(dataProcessApi).subscribe(response => {
                        console.log(response);
                        if (response['success']) {
                          // this.dataSuccess.push(res)
                          // console.log(this.dataSuccess);
                          response['transid'] = dataObj.transid;

                          resolve(response)

                          switch (dataForm.wstype) {
                            case this.informasiSaldoGiroCode:
                              this.isDisplayPrintSaldo = true;
                              this.done()
                              step.next()
                              break;
                            case this.informasiSaldoTabunganCode:
                              this.isDisplayPrintSaldo = true;
                              this.done()
                              step.next()
                              break;
                            default:
                              this.isDisplayPrint = true;
                              this.done()
                              step.next()
                              break;
                          }
                        }
                      })

                    })

                    dataConfirm.then(callback => {
                      // console.log(callback);
                      this.dataSuccess.push(callback)
                      console.log(this.dataSuccess);

                    });


                  }

                }
              }
            })

            // this.initializeWebSocketConnection('vldnas', step)
            // this.transacServ.verifyFingerCust(e['imageid'], this.token).subscribe(eres => {
            //   // console.log(eres);
            // })
          })
        } else {
          $('.otp-input').prop('readonly', false);
          this.pinMessage = 'PIN ' + res['message']
          this.isPinMessageError = true
        }

      })
    }
  }

  conv(event, index) {

    let dataForm: any = this.form.at(index).value;
    console.log(this.data[index]);


    console.log(event);
    console.log(dataForm);

    if (event.transid == dataForm.wstran || event.transid == dataForm.TransaksiId) {
      // console.log(true);
      return true
    } else {
      // console.log(false);
      return false
    }
  }

  cek(event) {
    // console.log(event);
    let data: any = event.wbtrbf;

    console.log(this.paymentCode);
    console.log(data);

    var re = this.transferAntarRekCode.substr(0, 1);
    var newstr = this.transferAntarRekCode.replace(re, "9");
    console.log(newstr)

    let show: any = new Object();


    // console.log(data.trntype);

    switch (data.wstype) {
      case this.setorTunaiCode.replace(this.setorTunaiCode.substr(0, 1), "9"):
        show.wstype = data.wstype;
        show.wstonm = data.wstonm;
        show.wsnomn = parseFloat(data.wsnomn);
        show.wstoto = data.wstoto;
        console.log(show);
        return show;
        break;
      case this.transferAntarRekCode.replace(this.transferAntarRekCode.substr(0, 1), "9"):
        show.wstype = data.wstype;
        show.wsfrnm = data.wsfrnm;
        show.wsfrom = data.wsfrom;
        show.wstonm = data.wstonm;
        show.wstoto = data.wstoto;
        show.wsnomn = parseFloat(data.wsnomn);
        show.wsbrta = data.wsbrta;
        console.log(show);
        return show;
      case this.paymentCode:
        show.wstype = data.wstype;
        show.wsbilid = data.wsbilid;
        show.wsnomn = data.wsnomn;
        show.wsspym = this.menuPayment.find(x => x.code === data.wspayc.substr(0, 6)).name ? this.menuPayment.find(x => x.code === data.wspayc.substr(0, 6)).name : "";
        console.log(show);
        return show;
      case this.transferAntarBankCode:
        show.wstype = data.wstype;
        show.wsbcod = data.wsbcod;
        show.wsfrnm = data.wsfrnm;
        show.wsfrom = data.wsfrom;
        show.wstonm = data.wstonm;
        show.wstoto = data.wstoto;
        show.wsnomn = data.wsnomn;
        show.wsbrta = data.wsbrta;
        console.log(show);
        return show;
      case this.tarikTunaiCode:
        show.wstype = data.wstype;
        show.wstonm = data.wstonm;
        show.wsfrom = data.wsfrom;
        show.wsnomn = data.wsnomn;
        console.log(show);
        return show;
      case this.informasiSaldoGiroCode:
        show.wstype = data.wstype;
        // show.wsfrnm = 
        // show.wsfrom = 
        // show.wstonm = 
        // show.wstoto = 
        // show.wsnomn = 
        // show.wsbrta = 
        console.log(show);
        return show;
      case this.informasiSaldoTabunganCode:
        show.wstype = data.trntype;
        // show.wsfrnm = 
        // show.wsfrom = 
        // show.wstonm = 
        // show.wstoto = 
        // show.wsnomn = 
        // show.wsbrta = 
        console.log(show);
        return show;
        break;
      default: break;
    }

    console.log(show);

  }

  //  ------------------------------------------------------------------------------------------------
  //  Call Cust Finger Verify                                                                |   3   |
  //  ------------------------------------------------------------------------------------------------
  callFingerVerify() {
    this.transacServ.verifyFingerCust(this.imageID, this.token).subscribe(eres => {
      // console.log(eres);
    })
  }

  //  ------------------------------------------------------------------------------------------------
  //  Header Customer                                                                         |   H   |
  //  ------------------------------------------------------------------------------------------------
  images64() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Image);
  }

  sign64() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Sign);
  }

  //  ------------------------------------------------------------------------------------------------
  //  Reader Card                                                                             |   X   |
  //  ------------------------------------------------------------------------------------------------
  cardReader(event) {
    let accountNumber: any;
    console.log("event kartu : ", event);

    if (event === undefined) {
      this.cardNum = 1234567890000003;
    } else {
      accountNumber = event;
      console.log("account number :", accountNumber.value);

      switch (accountNumber) {
        case "1001000001":
          this.cardNum = 1234567890123456;
          break;
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
  }

  //  ------------------------------------------------------------------------------------------------
  //  Check Refresh Transaction                                                               |   X   |
  //  ------------------------------------------------------------------------------------------------
  done() {
    this.refresh()
    // console.log(this.dataSuccess.length);
    // console.log(this.form.length);
    // console.log(this.form);
    let dataLength = this.dataSuccess.length + 1;
    if (dataLength === this.form.length) {
      this.isDoneBtn = true;
    } else {
      console.log('masih belum');
    }
  }

  //  ------------------------------------------------------------------------------------------------
  //  Refresh                                                                                |   x   |
  //  ------------------------------------------------------------------------------------------------
  refresh() {
    // Head Teller
    this.stepDisabledHorizontal = false
    this.isHeadTeller = false;
    this.isRejectTeller = true;
    this.isSelectHeadTeller = true;
    this.isWaiting = false;
    this.isRejected = false;
    this.isApproved = false;
    this.isPreview = true;
    // otorisasi pin Nasabah true false
    this.isPinMessageSuccess = false;
    this.isPinMessageError = false;
    this.isScanFinger = false;
    this.isSwapCard = true;
    this.isInputPin = false;
    this.isCardNumber = false;
    this.isFingerError = false;
    this.isFingerSuccess = false;
    this.cardNum = null;
    $('#scan-finger').removeClass('blink')
    $('#card-swap').removeClass('blink')
  }


  //  ================================================================================================
  //  Result and Print STEP 4
  //  ================================================================================================
  //  Print                                                                                   |   4   |
  //  ------------------------------------------------------------------------------------------------
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


  //  ------------------------------------------------------------------------------------------------
  //  Close Dialog                                                                           |   H   |
  //  ------------------------------------------------------------------------------------------------
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

  //  ------------------------------------------------------------------------------------------------
  //  Other Method                                                                           |   x   |
  //  ------------------------------------------------------------------------------------------------
  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    // console.log(animationItem);
  }

  close(reason: string) {
    console.log(reason);
    this.sidenav.close();
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

  onCheckBalance() {
    this.isDisplayPrintSaldo = true;
  }

  backStep(step: MatStepper) {
    this.done()
    this.isCancelBtn = true;
    this.isSkipBtn = true;
    this.isCloseDialog = true;
    step.previous()
  }

  fotoNasabahDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      name: "name",
      message: "test"
    };

    this.dialog.open(FotonasabahComponent, dialogConfig).afterClosed().subscribe(resBack => {
      this.base64Image = resBack;
    });
  }

  nasabahSignDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      name: "name",
      message: "test"
    };

    this.dialog.open(NasabahsignComponent, dialogConfig).afterClosed().subscribe(resBack => {
      this.base64Sign = resBack;
    });

  }

}
