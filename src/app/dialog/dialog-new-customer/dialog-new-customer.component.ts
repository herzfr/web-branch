import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-new-customer',
  templateUrl: './dialog-new-customer.component.html',
  styleUrls: ['./dialog-new-customer.component.css', './dialog-new-customer.component.scss']
})
export class DialogNewCustomerComponent implements OnInit {

  private dataLs: any;

  FormGroup: FormGroup;


  constructor(private dialogRef: MatDialogRef<DialogNewCustomerComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog) {
    this.dataLs = data.data;
    // console.log(new Date(this.dataLs.timestampentry));
    // let date = Math.floor(new Date(this.dataLs.timestampentry).getTime() / 1000.0)
    // console.log(date);

  }

  ngOnInit() {
  }

}
