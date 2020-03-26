import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-biometric',
  templateUrl: './user-biometric.component.html',
  styleUrls: ['./user-biometric.component.css']
})
export class UserBiometricComponent implements OnInit {

  private value: any;
  private returnValue: any = {};

  points = [];
  signatureImage: string;
  photoImage: string;

  isChangePictAndSign: boolean = false;
  canvasEl: any;
  ctx: CanvasRenderingContext2D;
  imageObj = new Image();



  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

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
    console.log("sending value : ", this.value);

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.startCamera()
  }


  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  attachVideo(stream) {
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
      }
    );

  }

  changePictAndSign() {

    // console.log(this.photoImage);
    // console.log(this.signatureImage);
  }

  compressFile() {

    var imgResultBeforeCompress: string;

    this.imageCompress.uploadFile().then(({ image, orientation }) => {

      imgResultBeforeCompress = image;
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));

      this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          this.photoImage = result;
          // console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
          // this.canvas.nativeElement.getContext('2d').drawImage(this.photoImage, 0, 0);
          this.canvasEl = this.canvas.nativeElement;
          this.ctx = this.canvasEl.getContext('2d');
          this.canvasEl.width = this.videoWidth;
          this.canvasEl.height = this.videoHeight;
          this.imageObj.src = result;

          console.log(result);
          console.log(this.imageObj);

          // this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
          this.ctx.drawImage(this.imageObj, 0, 0, this.canvasEl.width, this.canvasEl.height);
          // this.drawCircles();
        }
      );

    });
  }

  changeFinger() {
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
      } else {
        console.log(e['message']);

      }

    })
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
