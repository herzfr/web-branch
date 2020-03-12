import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatGridTileHeaderCssMatStyler } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { QueueService } from 'src/app/services/queue.service';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.css', './dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {

  data: any;
  dataForm: any;
  noQ: any;

  isLinear = false;
  form: FormArray;
  formGroup: FormGroup;


  constructor(private dialogRef: MatDialogRef<DialogTransactionComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private _formBuilder: FormBuilder,
    private queueServ: QueueService) {
    this.data = data.data;

    let forms = new Array;
    for (const key in data.data) {
      if (data.data.hasOwnProperty(key)) {
        const element = data.data[key];
        // console.log(element.transbuff[0]);
        this.noQ = element.queueno;
        let changeKey = element.transbuff[0]

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
        let dataForm = { "transid": element.transid, "transbuff": element.transbuff[0] };
        forms.push(dataForm)
      }
    }
    this.dataForm = forms;
    // console.log(this.dataForm);

  }

  ngOnInit() {

    this.formGroup = this._formBuilder.group({
      form: this._formBuilder.array([this.init('')])
    })

    for (const key in this.dataForm) {
      if (this.dataForm.hasOwnProperty(key)) {
        const element = this.dataForm[key];
        // console.log();
        this.addItem(element.transbuff);
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

  addItem(event) {
    // console.log(event);
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





}
