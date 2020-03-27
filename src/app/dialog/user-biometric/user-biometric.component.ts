import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UserService } from 'src/app/services/user.service';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-user-biometric',
  templateUrl: './user-biometric.component.html',
  styleUrls: ['./user-biometric.component.css']
})
export class UserBiometricComponent implements OnInit, AfterViewInit {

  private serverUrl = 'http://localhost:1111/socket'
  private stompClient;

  private value: any;
  private returnValue: any = {};

  points = [];
  signatureImage: string;
  photoImage: string;
  reqsuccess: string;

  isChangePictAndSign: boolean = false;
  ctx: CanvasRenderingContext2D;

  @ViewChild('video', { static: false }) videoElement: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;


  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 200 },
      height: { ideal: 200 }
    }
  };

  videoWidth = 0;
  videoHeight = 0;

  constructor(private dialogRef: MatDialogRef<UserBiometricComponent>, @Inject(MAT_DIALOG_DATA) data, private sanitizer: DomSanitizer,
    private renderer: Renderer2, private imageCompress: NgxImageCompressService, private userServ: UserService) {
    this.value = data.data;
    this.photoImage = data.data['imagepict']
    this.signatureImage = data.data['imagesign']
    console.log("sending value : ", this.value);

  }
  ngAfterViewInit(): void {
    console.log("afterinit");
    // console.log(this.videoElement.nativeElement.focus()); // mayo
    // this.isChangePictAndSign = !this.isChangePictAndSign;

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    // this.startCamera()
    this.initializeWebSocketConnection('userbiometric')
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
    this.imageCompress.compressFile(captureImgBeforeCompress, 50, 50).then(
      result => {
        // console.log(result);
        captureImgAfterCompress = result;
        this.photoImage = result;
        console.warn('Size in bytes is now:', this.imageCompress.byteCount(result))
      }
    );

  }

  showImage(data) {

    this.imageCompress.compressFile(data, 100, 100).then(
      result => {
        // console.log(result);
        this.signatureImage = result;
        console.warn('Size in bytes is now:', this.imageCompress.byteCount(result))
        if (result !== null || result !== undefined) {
          var strImage = this.photoImage.replace(/^data:image\/[a-z]+;base64,/, "");
          var strSign = this.signatureImage.replace(/^data:image\/[a-z]+;base64,/, "");

          var obj = {
            "imageid": this.value['imageid'],
            "imagepict": strImage,
            "imagesign": strSign
          }
          this.userServ.updateDataPict(obj).subscribe(e => {
            console.log(e);
            if (e['success']) {
              this.dialogRef.close()
              this.reqsuccess = 'Sukses'
            } else {
              console.log(e['message']);
            }

          })
        }
      }
    );

  }

  changePictAndSign() {
    this.isChangePictAndSign = !this.isChangePictAndSign;
    this.startCamera()
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
          console.log(image.src);

        }
      );

    });
  }

  changeFinger() {
    this.userServ.updateDataBiometric(this.value['username']).subscribe()
  }

  initializeWebSocketConnection(socket) {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({ "testing": "testaja" }, function (frame) {


      that.stompClient.subscribe("/" + socket, (message) => {

        if (message.body) {
          const body = JSON.parse(message.body);

          if (body.success) {
            that.stompClient.disconnect();
            that.dialogRef.close('reload')
            // console.log(body.token);
          }
        }

      }, () => {
        // that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      // that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }


  close() {
    this.returnValue.isRejected = false;
    this.dialogRef.close(this.returnValue);
  }


  imagesPict() {
    if (this.value['imagepict'] === null) {
      return 'assets/png/avatar.png';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.value['imagepict']);
    }
  }

  imagesSign() {

    if (this.value['imagesign'] === null) {
      return 'assets/png/signature.png';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.value['imagesign']);
    }
  }

  finger1() {
    if (this.value['imagefinger1'] === null) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.value['imagefinger1']);
    }
  }

  finger2() {
    if (this.value['imagefinger2'] === null) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.value['imagefinger2']);
    }
  }

  finger3() {
    if (this.value['imagefinger3'] === null) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.value['imagefinger3']);
    }
  }

  finger4() {
    if (this.value['imagefinger4'] === null) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.value['imagefinger4']);
    }
  }

  finger5() {
    if (this.value['imagefinger5'] === null) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.value['imagefinger5']);
    }
  }



}
