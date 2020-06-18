import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../fotonasabah/fotonasabah.component';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-nasabahsign',
  templateUrl: './nasabahsign.component.html',
  styleUrls: ['./nasabahsign.component.css']
})
export class NasabahsignComponent implements OnInit {


  private signatureImage: string;
  private value: any;

  constructor(public dialogRef: MatDialogRef<NasabahsignComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private renderer: Renderer2, private imageCompress: NgxImageCompressService) {
    console.log("data : ", data);
  }

  ngOnInit() {
  }


  showImage(data) {

    this.imageCompress.compressFile(data, 100, 100).then(
      result => {
        // console.log(result);
        this.signatureImage = result;
        console.warn('Size in bytes is now:', this.imageCompress.byteCount(result))
        if (result !== null || result !== undefined) {
          var strSign = this.signatureImage.replace(/^data:image\/[a-z]+;base64,/, "");
          var obj = {
            "imagesign": strSign
          }
        }
      }
    );

  }

  save(){
    this.dialogRef.close(this.signatureImage);
  }


}
