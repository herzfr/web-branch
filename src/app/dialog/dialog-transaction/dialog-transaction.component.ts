import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.css', './dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit {

  data: any;
  dataForm: any;


  isLinear = false;
  form: FormArray;
  formGroup: FormGroup;


  constructor(private dialogRef: MatDialogRef<DialogTransactionComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private _formBuilder: FormBuilder) {
    this.data = data.data;

    let forms = new Array;
    for (const key in data.data) {
      if (data.data.hasOwnProperty(key)) {
        const element = data.data[key];
        let asyiap = { "transid": element.transid, "transbuff": element.transbuff[0] };
        forms.push(asyiap)
      }
    }
    this.dataForm = forms;
    // console.log(this.dataForm);

  }

  ngOnInit() {

    this.formGroup = new FormGroup({})
    let formitem = new FormGroup({})

    for (const key in this.dataForm) {
      if (this.dataForm.hasOwnProperty(key)) {
        const element = this.dataForm[key];
        console.log(element.transid);

        let group = {}

        let ad = element.transid
        let tr: any = element.transbuff

        console.log(tr);

        for (const key in tr) {
          if (tr.hasOwnProperty(key)) {
            const el = tr[key];
            console.log(el);
            group[key] = new FormControl(el, Validators.required)
          }
        }

        formitem = new FormGroup(group)

        this.formGroup.addControl(tr, formitem)
      }

      console.log(this.formGroup);
      console.log(this.form);
    }



    // this.formGroup = this._formBuilder.group({
    //   form: this._formBuilder.array([this.setForm()])
    // })

    // this.form = this.formGroup.get('form') as FormArray;
    // this.form.push(this.formGroup)

    // group[el] = new FormControl(null, Validators.required)

    // this.formGroup = this._formBuilder.group({
    //   ad: this._formBuilder.array([])
    // })



  }

  setForm() {
    let group = {}

    for (const key in this.dataForm) {
      if (this.dataForm.hasOwnProperty(key)) {
        const element = this.dataForm[key];
        console.log(element.transid);
        let ad = element.transid
        let tr: any = element.transbuff

        for (const key in tr) {
          if (tr.hasOwnProperty(key)) {
            const el = tr[key];
            console.log(el);
            group[key] = new FormControl(el, Validators.required)
          }
        }
        // this.formGroup = new FormGroup(group)
        return new FormGroup(group)
      }



      // this.formGroup = this._formBuilder.group({
      //   form: this._formBuilder.array([this.init(element)])
      // })


      console.log(this.formGroup);
      console.log(this.form);


      // this.addItem();
    }
  }

  // init(element) {
  //   return this._formBuilder.group({
  //     element: new FormControl('', [Validators.required]),
  //   })
  // }

  // addItem() {

  //   this.form = this.formGroup.get('form') as FormArray;
  //   this.form.push(this.init(elem));

  //   console.log(this.form);

  // }


}
