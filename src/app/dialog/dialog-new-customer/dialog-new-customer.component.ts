import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { VerifyDialogComponent } from '../verify-dialog/verify-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import * as securels from 'secure-ls';
import { NasabahService } from 'src/app/services/nasabah.service';
import { DialogSuccessComponent } from '../dialog-success/dialog-success.component';
declare var $: any;


@Component({
  selector: 'app-dialog-new-customer',
  templateUrl: './dialog-new-customer.component.html',
  styleUrls: ['./dialog-new-customer.component.css', './dialog-new-customer.component.scss']
})
export class DialogNewCustomerComponent implements OnInit {

  private dataLs: any;
  private productInfo: FormGroup;
  private dataPemohon: FormGroup;
  private dataPekerjaan: FormGroup;
  private dataKerabat: FormGroup;
  private dataBiometri: any;

  // HEAD CS
  private headCS: any;
  // DATA SELECTED HEADCS
  private headSelected: any;

  // dialog return value properties
  private returnValue: any = {};

  showBiometric: boolean = true;
  showSend: boolean = false;
  formBuff: any;

  private biometricData: any;

  // MAIN LOCATION DATA
  private province: any;
  // DATA LOCATION PART I
  private kabkot: any;
  private dataKec: any;
  private dataKel: any;
  // DATA LOCATION PART II
  private kabkot2: any;
  private dataKec2: any;
  private dataKel2: any;
  // DATA LOCATION PART III
  private kabkot3: any;
  private dataKec3: any;
  private dataKel3: any;
  // DATA LOCATION PART IV
  private kabkot4: any;
  private dataKec4: any;
  private dataKel4: any;
  // DATA LOCATION PART V
  private kabkot5: any;
  private dataKec5: any;
  private dataKel5: any;

  // DATA RELIGION
  private dataEdu: any;

  private submitted = false;

  // BIOMETRI
  private photoImage: string;
  private signatureImage: string;
  private allFinger: any;

  // ENCODE / DECODE
  private ls = new securels({ encodingType: 'aes' });

  constructor(private dialogRef: MatDialogRef<DialogNewCustomerComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog,
    private formServ: FormService, private sanitizer: DomSanitizer, private nasabahServ: NasabahService) {
    // DATA AWAL
    this.dataLs = data.data;

    for (const key in data.data.transbuff) {
      if (data.data.transbuff.hasOwnProperty(key)) {
        const element = data.data.transbuff[key];
        console.log(element);
        data.data.transbuff = JSON.stringify(element);
      }
    }

    // INIT FORM GROUP
    this.productInfo = this.getproductInfo()
    this.dataPemohon = this.getDataPemohon()
    this.dataPekerjaan = this.getdataPekerjaan()
    this.dataKerabat = this.getdataKerabat()
    this.getDataLocation()

    // GET DATA EDUCATION
    this.formServ.getEducation().subscribe(e => {
      // console.log(e);
      this.dataEdu = e;
    })

    this.nasabahServ.headCSList("headcs", this.dataLs.branchcode).subscribe(e => {
      console.log(e);
      if (e['success']) {
        this.headCS = e['record']
      } else {
        this.headCS = null;
      }
    })

  }

  get form0() { return this.productInfo.controls; }
  get form1() { return this.dataPemohon.controls; }
  get form2() { return this.dataPekerjaan.controls; }
  get form3() { return this.dataKerabat.controls; }

  ngOnInit() {
    setTimeout(() => {
      console.log(this.productInfo);
    }, 1000)

    $('.cdk-overlay-pane').scroll(function () {
      // console.log($('.cdk-overlay-pane').scrollTop());
      if ($('.cdk-overlay-pane').scrollTop() > 100) {
        $('.mat-dialog-title').addClass('fixedTop');
      } else {
        $('.mat-dialog-title').removeClass('fixedTop');
      }
    })

  }



  getproductInfo() {
    // console.log(JSON.parse(this.dataLs.transbuff));
    let dataTransbuff = JSON.parse(this.dataLs.transbuff)
    let group: any = {};
    console.log(dataTransbuff.produkInfo);
    for (const key in dataTransbuff.produkInfo) {
      if (dataTransbuff.produkInfo.hasOwnProperty(key)) {
        const element = dataTransbuff.produkInfo[key];
        group[key] = new FormControl(element, Validators.required)
      }
    }
    return new FormGroup(group);
  }

  getDataPemohon() {
    let dataTransbuff = JSON.parse(this.dataLs.transbuff)
    let group: any = {};
    console.log(dataTransbuff.dataPemohon);
    for (const key in dataTransbuff.dataPemohon) {
      if (dataTransbuff.dataPemohon.hasOwnProperty(key)) {
        const element = dataTransbuff.dataPemohon[key];


        switch (key) {
          case 'tanggalLahir':
            var m = moment(element, 'DD-MM-YYYY', true)
            // return m.isValid() ? m.toDate() : new Date(NaN);
            if (m.isValid()) {
              console.log(m.toDate());
              group[key] = new FormControl(m.toDate());
            } else {
              group[key] = new FormControl(new Date(NaN));
            }
            break;
          case 'noHandphone':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'telpRumah':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'telpDomisili':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'noNpwp':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/), Validators.min(100000000000000), Validators.max(999999999999999)]);
            break;
          case 'tempatLahir':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
            break;
          case 'kodePos':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          case 'kodePosDomisili':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          default:
            group[key] = new FormControl(element, Validators.required)
            break;
        }
      }
    }
    console.log(group);

    return new FormGroup(group);
  }

  getdataPekerjaan() {
    let dataTransbuff = JSON.parse(this.dataLs.transbuff)
    let group: any = {};
    console.log(dataTransbuff.dataPekerjaan);
    for (const key in dataTransbuff.dataPekerjaan) {
      if (dataTransbuff.dataPekerjaan.hasOwnProperty(key)) {
        const element = dataTransbuff.dataPekerjaan[key];
        switch (key) {
          case 'kodePos':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          case 'telp':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          default:
            group[key] = new FormControl(element, Validators.required)
            break;
        }

      }
    }
    return new FormGroup(group);
  }

  getdataKerabat() {
    let dataTransbuff = JSON.parse(this.dataLs.transbuff)
    let group: any = {};
    console.log(dataTransbuff.dataKerabat);
    for (const key in dataTransbuff.dataKerabat) {
      if (dataTransbuff.dataKerabat.hasOwnProperty(key)) {
        const element = dataTransbuff.dataKerabat[key];
        group[key] = new FormControl(element)

        switch (key) {
          case 'telpKerabat':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'telpAhliWaris':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'kodePosKerabat':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          case 'kodePosAhliWaris':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          default:
            group[key] = new FormControl(element, Validators.required)
            break;
        }
      }
    }
    return new FormGroup(group);
  }

  getDataLocation() {
    this.formServ.getProvince().subscribe(e => {
      // console.log(e);
      this.province = e;

      // GET DATA DAERAH I
      this.formServ.getCity(this.dataPemohon.get('provinsi').value).subscribe(e => {
        // console.log(e);
        this.kabkot = e;
        // this.dataPemohon.get('kabupaten').disable()
        this.formServ.getDistrict(this.dataPemohon.get('kabupaten').value).subscribe(e => {
          // console.log(e);
          this.dataKec = e;
          // this.dataPemohon.get('kecamatan').disable()
          this.formServ.getVillage(this.dataPemohon.get('kecamatan').value).subscribe(e => {
            // console.log(e);
            this.dataKel = e;
            // this.dataPemohon.get('kelurahan').disable()
          })
        })
      })


      // GET DATA DAERAH II
      this.formServ.getCity(this.dataPemohon.get('provinsiDomisili').value).subscribe(e => {
        // console.log(e);
        this.kabkot2 = e;
        // this.dataPemohon.get('kabupatenDomisili').disable()
        this.formServ.getDistrict(this.dataPemohon.get('kabupatenDomisili').value).subscribe(e => {
          // console.log(e);
          this.dataKec2 = e;
          // this.dataPemohon.get('kecamatanDomisili').disable()
          this.formServ.getVillage(this.dataPemohon.get('kecamatanDomisili').value).subscribe(e => {
            // console.log(e);
            this.dataKel2 = e;
            // this.dataPemohon.get('kelurahanDomisili').disable()
          })
        })
      })

      // GET DATA DAERAH III
      this.formServ.getCity(this.dataPekerjaan.get('provinsi').value).subscribe(e => {
        // console.log(e);
        this.kabkot3 = e;
        // this.dataPekerjaan.get('kabupaten').disable()
        this.formServ.getDistrict(this.dataPekerjaan.get('kabupaten').value).subscribe(e => {
          // console.log(e);
          this.dataKec3 = e;
          // this.dataPekerjaan.get('kecamatan').disable()
          this.formServ.getVillage(this.dataPekerjaan.get('kecamatan').value).subscribe(e => {
            // console.log(e);
            this.dataKel3 = e;
            // this.dataPekerjaan.get('kelurahan').disable()
          })
        })
      })

      // GET DATA DAERAH IV
      this.formServ.getCity(this.dataKerabat.get('provinsiKerabat').value).subscribe(e => {
        // console.log(e);
        this.kabkot4 = e;
        // this.dataKerabat.get('kabupatenKerabat').disable()
        this.formServ.getDistrict(this.dataKerabat.get('kabupatenKerabat').value).subscribe(e => {
          // console.log(e);
          this.dataKec4 = e;
          // this.dataKerabat.get('kecamatanKerabat').disable()
          this.formServ.getVillage(this.dataKerabat.get('kecamatanKerabat').value).subscribe(e => {
            // console.log(e);
            this.dataKel4 = e;
            // this.dataKerabat.get('kelurahanKerabat').disable()
          })
        })
      })

      // GET DATA DAERAH V
      this.formServ.getCity(this.dataKerabat.get('provinsiAhliWaris').value).subscribe(e => {
        // console.log(e);
        this.kabkot5 = e;
        // this.dataKerabat.get('kabupatenAhliWaris').disable()
        this.formServ.getDistrict(this.dataKerabat.get('kabupatenAhliWaris').value).subscribe(e => {
          // console.log(e);
          this.dataKec5 = e;
          // this.dataKerabat.get('kecamatanAhliWaris').disable()
          this.formServ.getVillage(this.dataKerabat.get('kecamatanAhliWaris').value).subscribe(e => {
            // console.log(e);
            this.dataKel5 = e;
            // this.dataKerabat.get('kelurahanAhliWaris').disable()
          })
        })
      })

    })
  }

  onChangeProv(formGroup, formcontrol, chapter) {
    console.log(formGroup, formcontrol, chapter);
    // console.log(formGroup.get(formcontrol).value);

    switch (chapter) {
      case 1:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot = e;
          // this.dataPemohon.get('kabupaten').enable();
          this.dataPemohon.get('kecamatan').reset();
          this.dataPemohon.get('kelurahan').reset();
        })
        break;
      case 2:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot2 = e;
          // this.dataPemohon.get('kabupatenDomisili').enable();
          this.dataPemohon.get('kecamatanDomisili').reset();
          this.dataPemohon.get('kelurahanDomisili').reset();
        })
        break;
      case 3:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot3 = e;
          // this.dataPekerjaan.get('kabupaten').enable();
          this.dataPekerjaan.get('kecamatan').reset();
          this.dataPekerjaan.get('kelurahan').reset();
        })
        break;
      case 4:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot4 = e;
          // this.dataKerabat.get('kabupatenKerabat').enable();
          this.dataKerabat.get('kecamatanKerabat').reset();
          this.dataKerabat.get('kelurahanKerabat').reset();
        })
        break;
      case 5:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot5 = e;
          // this.dataKerabat.get('kabupatenAhliWaris').enable();
          this.dataKerabat.get('kecamatanAhliWaris').reset();
          this.dataKerabat.get('kelurahanAhliWaris').reset();
        })
        break;
    }
  }

  onChangeCity(formGroup, formcontrol, chapter) {
    console.log(formGroup, formcontrol, chapter);

    switch (chapter) {
      case 1:
        this.formServ.getDistrict(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKec = e;
          this.dataPemohon.get('kecamatan').enable();
          this.dataPemohon.get('kelurahan').reset();
        })
        break;
      case 2:
        this.formServ.getDistrict(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKec2 = e;
          this.dataPemohon.get('kecamatanDomisili').enable();
          this.dataPemohon.get('kelurahanDomisili').reset();
        })
        break;
      case 3:
        this.formServ.getDistrict(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKec3 = e;
          this.dataPekerjaan.get('kecamatan').enable();
          this.dataPekerjaan.get('kelurahan').reset();
        })
        break;
      case 4:
        this.formServ.getDistrict(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKec4 = e;
          this.dataKerabat.get('kecamatanKerabat').enable();
          this.dataKerabat.get('kelurahanKerabat').reset();
        })
        break;
      case 5:
        this.formServ.getDistrict(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKec5 = e;
          this.dataKerabat.get('kecamatanAhliWaris').enable();
          this.dataKerabat.get('kelurahanAhliWaris').reset();
        })
        break;
    }

  }


  onChangeDist(formGroup, formcontrol, chapter) {
    console.log(formGroup, formcontrol, chapter);

    switch (chapter) {
      case 1:
        this.formServ.getVillage(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKel = e;
          this.dataPemohon.get('kelurahan').enable();
        })
        break;
      case 2:
        this.formServ.getVillage(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKel2 = e;
          this.dataPemohon.get('kelurahanDomisili').enable();
        })
        break;
      case 3:
        this.formServ.getVillage(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKel3 = e;
          this.dataPekerjaan.get('kelurahan').enable();
        })
        break;
      case 4:
        this.formServ.getVillage(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKel4 = e;
          this.dataKerabat.get('kelurahanKerabat').enable();
        })
        break;
      case 5:
        this.formServ.getVillage(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.dataKel5 = e;
          this.dataKerabat.get('kelurahanAhliWaris').enable();
        })
        break;
    }

  }

  onChangeVill(formGroup, formcontrol, chapter) {
    console.log(formGroup, formcontrol, chapter);

    switch (chapter) {
      case 1:
        this.dataPemohon.get('kabupaten').updateValueAndValidity();
        this.dataPemohon.get('kecamatan').updateValueAndValidity();
        this.dataPemohon.get('kelurahan').updateValueAndValidity();
        break;
      case 2:
        this.dataPemohon.get('kabupatenDomisili').updateValueAndValidity();
        this.dataPemohon.get('kecamatanDomisili').updateValueAndValidity();
        this.dataPemohon.get('kelurahanDomisili').updateValueAndValidity();
        break;
      case 3:
        this.dataPekerjaan.get('kabupaten').updateValueAndValidity();
        this.dataPekerjaan.get('kecamatan').updateValueAndValidity();
        this.dataPekerjaan.get('kelurahan').updateValueAndValidity();
        break;
      case 4:
        this.dataKerabat.get('kabupatenKerabat').updateValueAndValidity();
        this.dataKerabat.get('kecamatanKerabat').updateValueAndValidity();
        this.dataKerabat.get('kelurahanKerabat').updateValueAndValidity();
        break;
      case 5:
        this.dataKerabat.get('kabupatenAhliWaris').updateValueAndValidity();
        this.dataKerabat.get('kecamatanAhliWaris').updateValueAndValidity();
        this.dataKerabat.get('kelurahanAhliWaris').updateValueAndValidity();
        break;
    }

  }


  getCityDataCenter(formG, formC, chapter) {
    this.formServ.getCity(formG.get(formC).value).subscribe(e => {
      console.log(e);
      return e;
    })
  }

  registerBio() {
    console.log(JSON.stringify(this.productInfo.value));
    console.log(JSON.stringify(this.dataPemohon.value));
    console.log(JSON.stringify(this.dataPekerjaan.value));
    console.log(JSON.stringify(this.dataKerabat.value));

    let buff =
      "{\"productInfo\":" + JSON.stringify(this.productInfo.value) +
      ",\"dataPemohon\":" + JSON.stringify(this.dataPemohon.value) +
      ",\"dataPekerjaan\":" + JSON.stringify(this.dataPekerjaan.value) +
      ",\"dataKerabat\":" + JSON.stringify(this.dataKerabat.value) +
      "}"

    console.log("isi buff :", buff);
    console.log("isi buff parse :", JSON.parse(buff));

    this.formBuff = buff;
    this.validatorDialog(this.productInfo.value, this.dataPemohon.value, this.dataPekerjaan.value, this.dataKerabat.value)
  }


  validatorDialog(data, data2, data3, data4) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: 0,
      data: [data, data2, data3, data4],
    }
    dialogConfig.backdropClass = 'backdropBackground';
    dialogConfig.disableClose = true;
    dialogConfig.width = '1200px';

    this.dialog.open(VerifyDialogComponent, dialogConfig).afterClosed().subscribe(e => {
      console.log(e);
      this.allFinger = e.finger;
      this.photoImage = e.photo;
      this.signatureImage = e.signature;
      this.dataBiometri = {
        "fingertemplate1": this.allFinger.fingerTemplate1,
        "fingertemplate2": this.allFinger.fingerTemplate2,
        "fingertemplate3": this.allFinger.fingerTemplate3,
        "fingertemplate4": this.allFinger.fingerTemplate4,
        "fingertemplate5": this.allFinger.fingerTemplate5,
        "imagefinger1": this.allFinger.imageFinger1,
        "imagefinger2": this.allFinger.imageFinger2,
        "imagefinger3": this.allFinger.imageFinger3,
        "imagefinger4": this.allFinger.imageFinger4,
        "imagefinger5": this.allFinger.imageFinger5,
        "name": this.dataPemohon.get('namaLengkap').value,
        "imagepict": this.photoImage,
        "imagesign": this.signatureImage,
        "imageid": 123456789012
      }

    })
  }

  photoImg() {
    if (this.photoImage === undefined) {
      return 'assets/png/avatar.png';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.photoImage);
    }
  }

  signImg() {
    if (this.signatureImage === undefined) {
      return 'assets/png/signature.png';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.signatureImage);
    }
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

  selectHead(event) {
    // console.log(event);
    this.headSelected = event;
  }

  sendConfirmation() {

    console.log(this.headSelected);

    if (this.headSelected !== undefined && this.headSelected !== "") {
      console.log(this.productInfo);
      console.log(this.dataPemohon);
      console.log(this.dataPekerjaan);
      console.log(this.productInfo);
      if (this.productInfo.valid) {
        if (this.dataPemohon.valid) {
          if (this.dataPekerjaan.valid) {
            if (this.dataKerabat.valid) {

              let TERMINAL = JSON.parse(this.ls.get('terminal'))
              let TERMINALUSER = JSON.parse(this.ls.get('termdata'))

              let dataTransbuff = {
                "produkInfo": this.productInfo.value,
                "dataPemohon": this.dataPemohon.value,
                "dataPekerjaan": this.dataPekerjaan.value,
                "dataKerabat": this.dataKerabat.value,
                "wbimage": this.dataBiometri,
              }

              // console.log(dataTransbuff);

              const dataProsesApi = {
                "transid": this.dataLs.transid,
                "branchcode": this.dataLs.branchcode,
                "terminalid": TERMINAL.terminalID,
                "queuedate": this.dataLs.queuedate,
                "queuecode": this.dataLs.queuecode,
                "queueno": this.dataLs.queueno.toString(),
                "timestampentry": this.dataLs.timestampentry,
                "userid": this.dataLs.userid,
                "userterminal": TERMINALUSER,
                "trntype": "nac",
                "transcnt": this.dataLs.transcnt,
                "transeq": this.dataLs.transeq,
                "isCash": this.dataLs.isCash,
                "iscustomer": this.dataLs.iscustomer,
                "id": this.dataLs.id,
                "status": "999",
                "username": this.headSelected,
                "transbuff": JSON.stringify(dataTransbuff),
              }

              console.log(dataProsesApi);
              console.log(this.headSelected);

              this.nasabahServ.accValidationNewAccount(this.headSelected, dataProsesApi).subscribe(e => {
                console.log(e);
                console.log(e['success']);
                // if (e[''])

                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                  id: 0,
                  data: e
                }
                dialogConfig.backdropClass = 'backdropBackground';
                dialogConfig.disableClose = true;
                // dialogConfig.width = '1200px';

                this.dialog.open(DialogSuccessComponent, dialogConfig).afterClosed().subscribe(e => {
                  if (e) {

                    let postStat = new Array;

                    let obj: any = new Object();
                    obj.transId = this.dataLs.transid;
                    obj.status = '000';
                    obj.type = 'finish'
                    postStat.push(obj)

                    this.dialogRef.close(postStat)
                  }

                })
              });

            } else {
              alert('Data Kerabat belum valid')
            }
          } else {
            alert('Data Pekerjaan belum valid')
          }
        } else {
          alert('Data Pemohon belum valid')
        }
      } else {
        alert('Data Product Info belum valid!')
      }
    } else {
      alert('Head CS belum dipilih')
    }
  }

  skipData() {
    let postStat = new Array;

    let obj: any = new Object();
    obj.transId = this.dataLs.transid;
    obj.status = '998';
    obj.type = 'skip';
    postStat.push(obj)

    this.dialogRef.close(postStat)
  }

  cancelData() {
    let postStat = new Array;

    let obj: any = new Object();
    obj.transId = this.dataLs.transid;
    obj.status = '100';
    obj.type = 'cancel';
    postStat.push(obj)

    this.dialogRef.close(postStat)
  }

  closeQDialog() {
    let postStat = new Array;

    let obj: any = new Object();
    obj.transId = this.dataLs.transid;
    obj.status = '998';
    obj.type = 'close';
    postStat.push(obj)

    this.dialogRef.close(postStat)
  }


}
