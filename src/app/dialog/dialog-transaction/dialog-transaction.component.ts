import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatGridTileHeaderCssMatStyler } from '@angular/material';
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


  GForm1: FormGroup;
  GForm2: FormGroup;
  GForm3: FormGroup;
  GForm4: FormGroup;
  GForm5: FormGroup;


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

    this.formGroup = this._formBuilder.group({
      form: this._formBuilder.array([this.init('')])
    })

    for (const key in this.dataForm) {
      if (this.dataForm.hasOwnProperty(key)) {
        const element = this.dataForm[key];
        console.log();

        this.addItem(element.transbuff);
      }
    }

    this.form.removeAt(0)


    console.log(this.formGroup);
    console.log(this.form);

  }

  init(event) {

    console.log(event);
    const jobGroup: FormGroup = new FormGroup({});

    let group = {}
    for (const key in event) {
      if (event.hasOwnProperty(key)) {
        const el = event[key];
        console.log(key);

        // const control: FormControl = new FormControl(event[key], Validators.required);
        // jobGroup.addControl(key, control)

        group[key] = new FormControl(el, Validators.required)
      }
    }

    console.log(group);
    // return this._formBuilder.group({
    //   group,
    // })

    return this._formBuilder.group({
      group
    })






    // return this._formBuilder.group({
    //   cont: new FormControl('', [Validators.required]),
    // })
  }

  addItem(event) {

    console.log(event);

    this.form = this.formGroup.get('form') as FormArray;
    this.form.push(this.init(event));

  }



}
