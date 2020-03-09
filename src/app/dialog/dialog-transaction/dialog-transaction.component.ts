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
  formGroup: FormGroup;
  form: FormArray;


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

    this.dataForm.forEach(element => {
      console.log(element.transid);
      var el = element.transid


      this.formGroup = this._formBuilder.group({
        el: this._formBuilder.array([this.init(element.transbuff)])
      })

      this.addItem(el);
    });



  }

  init(cont) {
    return this._formBuilder.group({
      cont: new FormControl('', [Validators.required]),
    })
  }

  addItem(id) {
    this.form = this.formGroup.get(id) as FormArray;
    this.form.push(this.init(id));
  }


}
