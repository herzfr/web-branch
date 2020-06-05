import { Component, OnInit, Inject, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { NasabahService } from 'src/app/services/nasabah.service';

@Component({
  selector: 'app-verify-dialog',
  templateUrl: './verify-dialog.component.html',
  styleUrls: ['./verify-dialog.component.css']
})
export class VerifyDialogComponent implements OnInit, AfterViewInit {

  private serverUrl = 'http://localhost:1111/socket'
  private stompClient;

  // dialog return value 
  private returnValue: any = {};
  private dataBiometric: any = {};

  private dataForm0;
  private dataForm1;
  private dataForm3;
  private dataForm4;


  private allFinger: any;
  private signatureImage: string;
  private photoImage: string;
  private fingerObject: any = {};
  private custName: string;

  // imgResultBeforeCompress: string;
  // imgResultAfterCompress: string;

  ctx: CanvasRenderingContext2D;

  @ViewChild('video', { static: false }) videoElement: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;

  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300,
    'penColor': "rgb(66, 133, 244)"
  };



  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 200 },
      height: { ideal: 200 }
    }
  };

  videoWidth = 0;
  videoHeight = 0;

  points = [];



  constructor(private dialogRef: MatDialogRef<VerifyDialogComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog,
    private sanitizer: DomSanitizer, private renderer: Renderer2, private imageCompress: NgxImageCompressService, private nasabahServ: NasabahService) {
    // console.log(data.data[1].namaLengkap);
    this.custName = data.data[1].namaLengkap;

  }

  ngOnInit() {
    this.initializeWebSocketConnection('nasabahbiometric')
    this.nasabahServ.callRegisterBiometric().subscribe()
    this.startCamera()
  }

  ngAfterViewInit() {

  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {


      that.stompClient.subscribe("/" + socket, (message) => {

        if (message.body) {
          const body = JSON.parse(message.body);
          console.log(body);
          that.allFinger = body;

          if (body.success) {
            that.stompClient.disconnect();
            that.dialogRef.close('reload')
            console.log(body);
          }
        }

      }, () => {
        // that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    // console.log('Error: ', error);
  }

  attachVideo(stream) {
    console.log(stream);
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }


  capture() {
    var captureImgBeforeCompress: string;
    var captureImgAfterCompress: string;
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);

    captureImgBeforeCompress = this.canvas.nativeElement.toDataURL("image/png")
    // console.log(captureImg);

    // console.warn('Size in bytes was:', this.imageCompress.byteCount(captureImg));
    this.imageCompress.compressFile(captureImgBeforeCompress, 100, 100).then(
      result => {
        // console.log(result);
        captureImgAfterCompress = result;
        this.photoImage = result;

        console.log("image byte : ", result);



        console.warn('Size in bytes is now:', this.imageCompress.byteCount(result))
      }
    );

  }

  showImage(data) {
    this.imageCompress.compressFile(data, 100, 100).then(
      result => {
        // console.log(result.replace(/^data:image\/[a-z]+;base64,/, ""));
        this.signatureImage = result;
        console.warn('Size in bytes is now:', this.imageCompress.byteCount(result))
      }
    );
  }



  compressFile() {
    var imgResultBeforeCompress: string;

    this.imageCompress.uploadFile().then(({ image, orientation }) => {

      imgResultBeforeCompress = image;
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));

      this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          this.photoImage = result;

          const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
          this.ctx = canvasEl.getContext('2d')!;
          let image = new Image()

          canvasEl.width = 500;
          canvasEl.height = 500;

          this.ctx.lineCap = 'round';
          image.onload = () => {
            this.ctx.drawImage(image, 0, 0, 500, 500);
          }
          image.src = result
          // this.photoImage = image.src;\
          console.log(image.src.split(',').pop());


        }
      );

    });
  }

  finger1() {
    // console.log(this.allFinger);

    if (this.allFinger === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allFinger.imageFinger1);
    }
  }

  finger2() {
    // console.log(this.allFinger);

    if (this.allFinger === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allFinger.imageFinger2);
    }
  }

  finger3() {
    // console.log(this.allFinger);

    if (this.allFinger === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allFinger.imageFinger3);
    }
  }

  finger4() {
    // console.log(this.allFinger);

    if (this.allFinger === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allFinger.imageFinger4);
    }
  }

  finger5() {
    // console.log(this.allFinger);

    if (this.allFinger === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allFinger.imageFinger5);
    }
  }


  closeDial() {
    this.dialogRef.close()
  }

  finish() {

    console.log(this.photoImage);
    console.log(this.signatureImage);



    if (this.allFinger === undefined || this.photoImage === undefined || this.signatureImage === undefined) {
      alert('Data masih ada yang kosong, ilahkan isi terlebih dahulu')
    } else {
      var biometric = {
        finger: this.allFinger,
        signature: this.signatureImage.replace(/^data:image\/[a-z]+;base64,/, ""),
        photo: this.photoImage.replace(/^data:image\/[a-z]+;base64,/, "")
      }
      console.log(this.allFinger);
      console.log(this.signatureImage);
      console.log(this.photoImage);

      this.dialogRef.close(biometric)
    }

  }

}
