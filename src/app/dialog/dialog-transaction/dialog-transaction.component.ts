import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatGridTileHeaderCssMatStyler, MatStepper, MatSidenav, MatDrawer } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { QueueService } from 'src/app/services/queue.service';
declare var $: any;

import * as SecureLS from 'secure-ls';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { TransactionService } from 'src/app/services/transaction.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.css', './dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {

  private data: any;
  private dataForm: any;
  private noQ: any;

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

  stepDisabled: boolean = true;

  secureLs = new SecureLS({ encodingType: 'aes' });
  config = {
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

  // Otorisasi Head Teller
  private isDisplayPrint: boolean = false;
  private isWaitingConfirmation: boolean = false;
  private isRejectConfirmation: boolean = false;

  namaHead: any = [
    { value: '12312213123', viewValue: 'Mamank Racing' },
    { value: '12312213123', viewValue: 'Kakek Sugiono' },
    { value: '12312213123', viewValue: 'Tatang Bengkel' }
  ];


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

  base64Image = 'assets/png/avatar.png';
  base64Sign = 'assets/png/signature.png';
  NAME_CUST = 'John Lennon';



  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild('ngOtpInput', { static: true }) ngOtpInputRef: any;

  constructor(private dialogRef: MatDialogRef<DialogTransactionComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private _formBuilder: FormBuilder,
    private queueServ: QueueService, private transacServ: TransactionService, private sanitizer: DomSanitizer) {
    this.data = data.data;


    let forms = new Array;
    for (const key in data.data) {
      if (data.data.hasOwnProperty(key)) {
        const element = data.data[key];
        // console.log(element.trntype);
        this.noQ = element.queueno;
        let changeKey = element.transbuff[0]
        this.transID_for_while = element.transid
        this.status_for_while = element.status
        for (const key in changeKey) {
          if (changeKey.hasOwnProperty(key)) {
            const e = changeKey[key];
            // console.log(key);

            switch (key) {
              case 'nm':
                changeKey.Nominal = e
                break;
              case 'tn':
                changeKey.Tunai = e
                break;
              case 'tp':
                changeKey.Tipe = e
                break;
              case 'fr':
                changeKey.Dari = e
                break;
              case 'to':
                changeKey.Ke = e
                break;
              case 'br':
                changeKey.Berita = e
                break;
              case 'bc':
                changeKey.Bank = e
                break;
              default:
                break;
            }

          }
        }

        delete changeKey.nm
        delete changeKey.tn
        delete changeKey.tp
        delete changeKey.fr
        delete changeKey.to
        delete changeKey.br
        delete changeKey.bc

        if (changeKey.Tipe === 'trk') {
          changeKey.Tipe = 'Tarik Tunai'
        } else if (changeKey.Tipe === 'str') {
          changeKey.Tipe = 'Setor Tunai'
        } else if (changeKey.Tipe === 'tar') {
          changeKey.Tipe = 'Transaksi Antar Rekening'
        } else if (changeKey.Tipe === 'tab') {
          changeKey.Tipe = 'Transaksi Antar Bank'
        }

        if (changeKey.Tunai === '1') {
          changeKey.Tunai = 'Ya'
        } else if (changeKey.Tunai === '0') {
          changeKey.Tunai = 'Tidak'
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
        // console.log(element.transid);
        console.log(element);
        this.addItem(element.transbuff, element.transid);
      }
    }
    this.form.removeAt(0)
    // console.log(this.formGroup);
    // console.log(this.form);
  }

  init(event) {
    // console.log(event);
    const orderFormGroup: FormGroup = new FormGroup({});
    for (const key in event) {
      if (event.hasOwnProperty(key)) {
        const el = event[key];
        // console.log(key);

        const control: FormControl = new FormControl(el, Validators.required);
        orderFormGroup.addControl(key, control)
        // group[key] = new FormControl(el, Validators.required)
      }
    }
    // console.log(orderFormGroup);
    return orderFormGroup;
  }

  addItem(event, transid) {
    // console.log(event);
    event.TransaksiId = transid;
    // event.
    console.log(event);

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

    // this.queueServ.changeStatusTransactionQ(postStat).subscribe(res => {
    //   console.log(res);
    //   this.dialogRef.close(res);
    // })
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

    // console.log(postStat);
    // this.queueServ.changeStatusTransactionQ(postStat).subscribe(res => {
    //   console.log(res);
    //   this.dialogRef.close(res);
    // })
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

    // this.queueServ.changeStatusTransactionQ(postStat).subscribe(res => {
    //   console.log(res);
    //   this.dialogRef.close(res);
    // })
  }


  transactionCancel(i, event) {
    console.log(i, event)

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

  transactionProcess(event) {
    console.log(event);
    let transId = event.TransaksiId.value
    let dataObj = this.findDataByTransactionId(transId, this.data)
    // let terminal = JSON.parse(localStorage.getItem('terminal'))
    let terminal = JSON.parse(this.secureLs.get("terminal"))
    let branchCode = terminal.branchCode;
    let term = terminal.terminalID;

    // console.log(dataObj);
    let Form = new FormGroup(event)
    let payLoad = JSON.stringify(Form.value);
    // console.log(payLoad);

    const dataProsesApi = {
      "transid": transId,
      "branchcode": branchCode,
      "terminalid": term,
      "queuedate": dataObj.queuedate,
      "queuecode": dataObj.queuecode,
      "queueno": dataObj.queueno.toString(),
      "timestampentry": dataObj.timestampentry.toString(),
      "userid": dataObj.userid,
      // "userid": "23423423423423423423423423423423",
      "userterminal": dataObj.userterminal,
      "trntype": event.Tipe.value,
      "status": "",
      "transbuff": payLoad,
    }

    console.log(dataProsesApi);
    this.queueServ.processTransactionDataQ(dataProsesApi).subscribe(res => {
      console.log(res);
      if (res['success']) {
        // console.log('sucess');
        this.dataSuccess.push(res)
        setTimeout(() => {
          this.isProsses = false;
          this.isSuccess = true;
          $(".check-icon").show();
          this.isNext = true;
          this.isCancelBtn = false;
          this.isSkipBtn = false;
        }, 500)
      } else {
        console.log('gagal');
        setTimeout(() => {
          this.isProsses = false;
          this.isError = true;
          this.isBack = true;
        }, 500)
      }
    })

    console.log(this.dataSuccess);
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

  // setDataPrint(event) {
  //   this._printData = JSON.parse(event.transbuff)
  //   console.log(this._printData);
  // }

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
    // $('#print-section').printThis();
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



    // const toShow = this.hideParentSiblings($('#print-section'));
    // $('#print-section').hide();
    // window.print();
    // for (const e of toShow) {
    //   e.show();
    // }
    // $('#form-sibling').show();

    // setTimeout(() => {
    //   $('#print').modal('hide')
    // }, 3000)
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
    console.log(event, stepper.selected.interacted);
    stepper.selected.interacted = false;
  }

  done() {
    if (this.dataSuccess.length === this.form.length) {
      console.log('suses di isi semua');
      this.isDoneBtn = true;
    } else {
      console.log('masih belum');
    }
  }

  closeQDialog() {
    // this.dialogRef.close();

    if (this.status_for_while === 999) {
      let arr = new Array;
      let obj: any = new Object();
      obj.transId = this.transID_for_while;
      obj.status = '998';

      console.log(obj);
      arr.push(obj)

      this.queueServ.changeStatusTransactionQ(arr).subscribe(e => {
        console.log(e);
        if (e['successId0']) {
          this.form.reset()
          this.formGroup.reset()
          this.queueServ.refreshQ('034').subscribe()
          this.dialogRef.close();
        } else {
          console.log('data tidak ada');
        }
      })
    } else if (this.status_for_while === 998) {
      let arr = new Array;
      let obj: any = new Object();
      obj.transId = this.transID_for_while;
      obj.status = '998';

      console.log(obj);
      arr.push(obj)

      this.queueServ.changeStatusTransactionQ(arr).subscribe(e => {
        console.log(e);
        if (e['successId0']) {
          this.form.reset()
          this.formGroup.reset()
          this.queueServ.refreshQ('034').subscribe()
          this.dialogRef.close();
        } else {
          console.log('data tidak ada');
        }
      })
    }
  }

  onSwapCard() {
    this.cardNum = 1234567890000003;

    if (this.cardNum !== null) {
      this.isInputPin = true
      this.isCardNumber = true
      $('#card-swap').removeClass('blink')
    }

  }

  onOtpChange(event: any) {

    if (event.length == 6) {
      console.log('cukup');
      $('.otp-input').blur();
      $('.otp-input').prop('readonly', true);
      this.transacServ.verifyCard(this.cardNum, event).subscribe(res => {
        console.log(res);
        if (res['success']) {
          console.log(res['message']);
          this.isScanFinger = true;
          $('#scan-finger').addClass('blink')
          this.pinMessage = 'Pin Sukses'
          this.isPinMessageSuccess = true
          this.isPinMessageError = false
          this.transacServ.getInfoCardPerson(res['record']).subscribe(e => {
            console.log(e);
            this.base64Image = 'data:image/png;base64,' + e['imagepict']
            this.base64Sign = 'data:image/png;base64,' + e['imagesign']
            this.NAME_CUST = e['name']
            this.images64()
          })
        } else {
          console.log(res['message']);
          console.log(this.ngOtpInputRef);
          $('.otp-input').prop('readonly', false);
          this.pinMessage = 'PIN ' + res['message']
          this.isPinMessageError = true
        }
      })
    } else {
      console.log('belum cukup');
      this.pinMessage = 'Pin Masih Kurang'
      this.isPinMessageError = true
    }
  }

  images64() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Image);
  }
  sign64() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Sign);
  }

  onFingerVerify(stepper: MatStepper) {
    let finger = true

    if (finger) {
      this.fingerMessage = 'Finger Valid'
      this.isFingerSuccess = true
      this.isFingerError = false
      $('#scan-finger').removeClass('blink')
      setTimeout(() => {
        stepper.next()
      }, 1000)
    } else {
      this.isFingerError = true
      this.fingerMessage = 'Finger Invalid'
    }

  }

  onOtorisationFinger() {
  }

  openSideNav() {
    console.log(this.sidenav);
  }

  animationCreated(animationItem: AnimationItem): void {
    // this.animationItem = animationItem;
    console.log(animationItem);

  }

  close(reason: string) {
    console.log(reason);
    this.sidenav.close();
  }

  onOtorisation(event, stepper: MatStepper, drawer: MatDrawer) {
    // console.log(event);

    switch (event) {
      case 'now':
        console.log('now');
        setTimeout(() => {
          drawer.toggle()
          setTimeout(() => {
            stepper.next()
            this.isDisplayPrint = true;
          }, 500)
        }, 1000)
        break;
      case 'request':
        console.log('request');
        stepper.next()
        this.isWaitingConfirmation = true;
        break;
      case 'reject':
        console.log('reject');
        this.isRejectConfirmation = true;
        stepper.next()
        break;
      default:
        break;



    }

  }

}
