import { Component, OnInit, Inject } from '@angular/core';
import * as SecureLS from 'secure-ls';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AnimationOptions } from 'ngx-lottie';
import { DialogService } from 'src/app/services/dialog.service';
import { AppConfiguration } from 'src/app/models/app.configuration';
import { UserDataService } from 'src/app/services/user-data.service';
import { Subscription } from 'rxjs';
import { NasabahService } from 'src/app/services/nasabah.service';

@Component({
  selector: 'app-head-confirm',
  templateUrl: './head-confirm.component.html',
  styleUrls: ['./head-confirm.component.css']
})
export class HeadConfirmComponent implements OnInit {

  private serverUrl: string;
  private stompClient;

  ls = new SecureLS({ encodingType: 'aes' });

  private value: any;
  private returnValue: any = {};
  private isFingerSuccess: boolean = false;
  private userName: string;
  private userToken: string;

  private subVerify: Subscription;

  private options: AnimationOptions = {
    path: '/assets/lottie/fingerprint.json'
  };

  constructor(private dialogRef: MatDialogRef<HeadConfirmComponent>, @Inject(MAT_DIALOG_DATA) data, private dialog: DialogService,
    private userDataService: UserDataService, private appConfig: AppConfiguration, private nasabahServ: NasabahService) {
    this.value = data.value;


    this.serverUrl = this.appConfig.ipLocalHostSocket;

    console.log("server url : ", this.appConfig.ipLocalHostSocket)

  }


  ngOnInit() {
    this.userName = this.userDataService.getUserData().username;
    this.userToken = this.userDataService.getUserToken();
  }

  ngAfterViewInit(): void {
    this.callFingerService();
  }

  ngOnDestroy(): void {
  }

  close() {
    this.returnValue.returnType = 1;
    this.dialogRef.close(this.returnValue);
  }

  approve() {
    this.returnValue.returnType = 2;
    this.dialogRef.close(this.returnValue);
  }

  reject() {
    this.returnValue.returnType = 3;
    this.dialogRef.close(this.returnValue);
  }

  callFingerService() {

    this.subVerify = this.nasabahServ.callApp().subscribe(res => {
      let value = res;
      console.log(value);

      if (value['success']) {
        this.callHeadValidation();
      }
    });
  }

  callHeadValidation() {
    this.subVerify = this.nasabahServ.verifyFingerHead(this.userName, this.userToken).subscribe(res => {
      let value = res;
      console.log(value);

      if (value['success']) {

        this.initializeWebSocketConnection("vldspvcs")
        setTimeout(() => {
          this.subVerify.unsubscribe();
        }, 1000);
      }
    });
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
            that.isFingerSuccess = true;
          }
        }

      }, () => {
        that.dialog.errorDialog("Error", "Koneksi Terputus");
      });
    }, err => {
      that.dialog.errorDialog("Error", "Gagal Menghubungkan Koneksi Ke Server ");
    });
  }


}
