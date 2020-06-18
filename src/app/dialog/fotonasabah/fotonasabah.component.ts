import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxImageCompressService } from 'ngx-image-compress';

export interface DialogData {
  message: string;
  name: string;
}

@Component({
  selector: 'app-fotonasabah',
  templateUrl: './fotonasabah.component.html',
  styleUrls: ['./fotonasabah.component.css']
})
export class FotonasabahComponent implements OnInit {

  ctx: CanvasRenderingContext2D;
  @ViewChild('video', { static: false }) videoElement: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  private photoImage: string;

  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 200 },
      height: { ideal: 200 }
    }
  };

  videoWidth = 0;
  videoHeight = 0;

  constructor(public dialogRef: MatDialogRef<FotonasabahComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private renderer: Renderer2, private imageCompress: NgxImageCompressService) {
    console.log("data : ", data);
  }

  ngOnInit() {
    this.startCamera();
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  attachVideo(stream) {
    console.log(stream);
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  handleError(error) {
    // console.log('Error: ', error);
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
        // console.log("image byte : ", result);
        // console.warn('Size in bytes is now:', this.imageCompress.byteCount(result))
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
          console.log("result : ", result);

          this.photoImage = image.src;
        }
      );
    });
  }

  save() {
    this.dialogRef.close(this.photoImage);
  }

}
