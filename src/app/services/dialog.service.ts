import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogErrorComponent } from '../dialog/dialog-error/dialog-error.component';
import { DialogTransactionComponent } from '../dialog/dialog-transaction/dialog-transaction.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  errorDialog(message, message2) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 1,
      message: message,
      message2: message2
    };
    this.dialog.open(DialogErrorComponent, dialogConfig);
  }


}
