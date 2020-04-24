import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import * as securels from 'secure-ls';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-head-cs-dialog',
  templateUrl: './head-cs-dialog.component.html',
  styleUrls: ['./head-cs-dialog.component.css']
})
export class HeadCsDialogComponent implements OnInit {

  private data;
  private id: number;

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

  constructor(private dialogRef: MatDialogRef<HeadCsDialogComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private formServ: FormService,
    private sanitizer: DomSanitizer) {
    this.id = data.id
    this.dataLs = data.message;
    console.log("data : ", this.dataLs);

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
  }

  ngOnInit() {
  }

  closeInfo() {
    this.dialogRef.close()
  }

  get form0() { return this.productInfo.controls; }
  get form1() { return this.dataPemohon.controls; }
  get form2() { return this.dataPekerjaan.controls; }
  get form3() { return this.dataKerabat.controls; }


  getproductInfo() {
    let group: any = {};
    // console.log(this.dataLs.produkInfo);
    for (const key in this.dataLs.produkInfo) {
      if (this.dataLs.produkInfo.hasOwnProperty(key)) {
        const element = this.dataLs.produkInfo[key];
        group[key] = new FormControl(element, Validators.required)
      }
    }
    console.log(group);
    return new FormGroup(group);
  }

  getDataPemohon() {

    let group: any = {};
    // console.log(this.dataLs.dataPemohon);
    for (const key in this.dataLs.dataPemohon) {
      if (this.dataLs.dataPemohon.hasOwnProperty(key)) {
        const element = this.dataLs.dataPemohon[key];


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
    let group: any = {};
    // console.log(this.dataLs.dataPekerjaan);
    for (const key in this.dataLs.dataPekerjaan) {
      if (this.dataLs.dataPekerjaan.hasOwnProperty(key)) {
        const element = this.dataLs.dataPekerjaan[key];
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
    console.log(group);
    return new FormGroup(group);
  }

  getdataKerabat() {
    let group: any = {};
    // console.log(this.dataLs.dataKerabat);
    for (const key in this.dataLs.dataKerabat) {
      if (this.dataLs.dataKerabat.hasOwnProperty(key)) {
        const element = this.dataLs.dataKerabat[key];
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
    console.log(group);

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
        console.log(this.dataPemohon);

        this.dataPemohon.get('kabupaten').disable()
        this.formServ.getDistrict(this.dataPemohon.get('kabupaten').value).subscribe(e => {
          // console.log(e);
          this.dataKec = e;
          this.dataPemohon.get('kecamatan').disable()
          this.formServ.getVillage(this.dataPemohon.get('kecamatan').value).subscribe(e => {
            // console.log(e);
            this.dataKel = e;
            this.dataPemohon.get('kelurahan').disable()
          })
        })
      })


      // GET DATA DAERAH II
      this.formServ.getCity(this.dataPemohon.get('provinsiDomisili').value).subscribe(e => {
        // console.log(e);
        this.kabkot2 = e;
        this.dataPemohon.get('kabupatenDomisili').disable()
        this.formServ.getDistrict(this.dataPemohon.get('kabupatenDomisili').value).subscribe(e => {
          // console.log(e);
          this.dataKec2 = e;
          this.dataPemohon.get('kecamatanDomisili').disable()
          this.formServ.getVillage(this.dataPemohon.get('kecamatanDomisili').value).subscribe(e => {
            // console.log(e);
            this.dataKel2 = e;
            this.dataPemohon.get('kelurahanDomisili').disable()
          })
        })
      })

      // GET DATA DAERAH III
      this.formServ.getCity(this.dataPekerjaan.get('provinsi').value).subscribe(e => {
        // console.log(e);
        this.kabkot3 = e;
        this.dataPekerjaan.get('kabupaten').disable()
        this.formServ.getDistrict(this.dataPekerjaan.get('kabupaten').value).subscribe(e => {
          // console.log(e);
          this.dataKec3 = e;
          this.dataPekerjaan.get('kecamatan').disable()
          this.formServ.getVillage(this.dataPekerjaan.get('kecamatan').value).subscribe(e => {
            // console.log(e);
            this.dataKel3 = e;
            this.dataPekerjaan.get('kelurahan').disable()
          })
        })
      })

      console.log(this.productInfo.controls);
      console.log(this.dataPemohon.controls);
      console.log(this.dataPekerjaan.controls);
      console.log(this.dataKerabat.controls);


      // GET DATA DAERAH IV
      this.formServ.getCity(this.dataKerabat.get('provinsiKerabat').value).subscribe(e => {
        // console.log(e);
        this.kabkot4 = e;
        this.dataKerabat.get('kabupatenKerabat').disable()
        this.formServ.getDistrict(this.dataKerabat.get('kabupatenKerabat').value).subscribe(e => {
          // console.log(e);
          this.dataKec4 = e;
          this.dataKerabat.get('kecamatanKerabat').disable()
          this.formServ.getVillage(this.dataKerabat.get('kecamatanKerabat').value).subscribe(e => {
            // console.log(e);
            this.dataKel4 = e;
            this.dataKerabat.get('kelurahanKerabat').disable()
          })
        })
      })

      // GET DATA DAERAH V
      this.formServ.getCity(this.dataKerabat.get('provinsiAhliWaris').value).subscribe(e => {
        // console.log(e);
        this.kabkot5 = e;
        this.dataKerabat.get('kabupatenAhliWaris').disable()
        this.formServ.getDistrict(this.dataKerabat.get('kabupatenAhliWaris').value).subscribe(e => {
          // console.log(e);
          this.dataKec5 = e;
          this.dataKerabat.get('kecamatanAhliWaris').disable()
          this.formServ.getVillage(this.dataKerabat.get('kecamatanAhliWaris').value).subscribe(e => {
            // console.log(e);
            this.dataKel5 = e;
            this.dataKerabat.get('kelurahanAhliWaris').disable()
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
          this.dataPemohon.get('kabupaten').enable();
          this.dataPemohon.get('kecamatan').reset();
          this.dataPemohon.get('kelurahan').reset();
        })
        break;
      case 2:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot2 = e;
          this.dataPemohon.get('kabupatenDomisili').enable();
          this.dataPemohon.get('kecamatanDomisili').reset();
          this.dataPemohon.get('kelurahanDomisili').reset();
        })
        break;
      case 3:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot3 = e;
          this.dataPekerjaan.get('kabupaten').enable();
          this.dataPekerjaan.get('kecamatan').reset();
          this.dataPekerjaan.get('kelurahan').reset();
        })
        break;
      case 4:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot4 = e;
          this.dataKerabat.get('kabupatenKerabat').enable();
          this.dataKerabat.get('kecamatanKerabat').reset();
          this.dataKerabat.get('kelurahanKerabat').reset();
        })
        break;
      case 5:
        this.formServ.getCity(formGroup.get(formcontrol).value).subscribe(e => {
          console.log(e);
          this.kabkot5 = e;
          this.dataKerabat.get('kabupatenAhliWaris').enable();
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
        this.dataPemohon.get('kabupaten').disable();
        this.dataPemohon.get('kecamatan').disable();
        this.dataPemohon.get('kelurahan').disable();
        break;
      case 2:
        this.dataPemohon.get('kabupatenDomisili').disable();
        this.dataPemohon.get('kecamatanDomisili').disable();
        this.dataPemohon.get('kelurahanDomisili').disable();
        break;
      case 3:
        this.dataPekerjaan.get('kabupaten').disable();
        this.dataPekerjaan.get('kecamatan').disable();
        this.dataPekerjaan.get('kelurahan').disable();
        break;
      case 4:
        this.dataKerabat.get('kabupatenKerabat').disable();
        this.dataKerabat.get('kecamatanKerabat').disable();
        this.dataKerabat.get('kelurahanKerabat').disable();
        break;
      case 5:
        this.dataKerabat.get('kabupatenAhliWaris').disable();
        this.dataKerabat.get('kecamatanAhliWaris').disable();
        this.dataKerabat.get('kelurahanAhliWaris').disable();
        break;
    }

  }


  getCityDataCenter(formG, formC, chapter) {
    this.formServ.getCity(formG.get(formC).value).subscribe(e => {
      console.log(e);
      return e;
    })
  }

  // registerBio() {
  //   console.log(JSON.stringify(this.productInfo.value));
  //   console.log(JSON.stringify(this.dataPemohon.value));
  //   console.log(JSON.stringify(this.dataPekerjaan.value));
  //   console.log(JSON.stringify(this.dataKerabat.value));

  //   let buff =
  //     "{\"productInfo\":" + JSON.stringify(this.productInfo.value) +
  //     ",\"dataPemohon\":" + JSON.stringify(this.dataPemohon.value) +
  //     ",\"dataPekerjaan\":" + JSON.stringify(this.dataPekerjaan.value) +
  //     ",\"dataKerabat\":" + JSON.stringify(this.dataKerabat.value) +
  //     "}"

  //   console.log("isi buff :", buff);
  //   console.log("isi buff parse :", JSON.parse(buff));

  //   this.formBuff = buff;



  //   this.validatorDialog(this.productInfo.value, this.dataPemohon.value, this.dataPekerjaan.value, this.dataKerabat.value)
  // }


  // validatorDialog(data, data2, data3, data4) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = {
  //     id: 0,
  //     data: [data, data2, data3, data4],
  //   }
  //   dialogConfig.backdropClass = 'backdropBackground';
  //   dialogConfig.disableClose = true;
  //   dialogConfig.width = '1200px';

  //   this.dialog.open(VerifyDialogComponent, dialogConfig).afterClosed().subscribe(e => {
  //     console.log(e);
  //     this.allFinger = e.finger;
  //     this.photoImage = e.photo;
  //     this.signatureImage = e.signature;
  //     this.dataBiometri = {
  //       "fingertemplate1": this.allFinger.fingerTemplate1,
  //       "fingertemplate2": this.allFinger.fingerTemplate2,
  //       "fingertemplate3": this.allFinger.fingerTemplate3,
  //       "fingertemplate4": this.allFinger.fingerTemplate4,
  //       "fingertemplate5": this.allFinger.fingerTemplate5,
  //       "imagefinger1": this.allFinger.imageFinger1,
  //       "imagefinger2": this.allFinger.imageFinger2,
  //       "imagefinger3": this.allFinger.imageFinger3,
  //       "imagefinger4": this.allFinger.imageFinger4,
  //       "imagefinger5": this.allFinger.imageFinger5,
  //       "name": this.dataPemohon.get('namaLengkap').value,
  //       "imagepict": this.photoImage,
  //       "imagesign": this.signatureImage,
  //       "imageid": 123456789012
  //     }

  //   })
  // }

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

  // sendConfirmation() {

  //   console.log(this.headSelected);

  //   if (this.headSelected !== undefined && this.headSelected !== "") {
  //     // console.log(this.productInfo.valid);
  //     // console.log(this.dataPemohon.valid);
  //     // console.log(this.dataPekerjaan.valid);
  //     // console.log(this.productInfo.valid);
  //     if (this.productInfo.valid) {
  //       if (this.dataPemohon.valid) {
  //         if (this.dataPekerjaan.valid) {
  //           if (this.dataKerabat.valid) {

  //             let TERMINAL = JSON.parse(this.ls.get('terminal'))
  //             let TERMINALUSER = JSON.parse(this.ls.get('termdata'))

  //             let dataTransbuff = {
  //               "produkInfo": this.productInfo.value,
  //               "dataPemohon": this.dataPemohon.value,
  //               "dataPekerjaan": this.dataPekerjaan.value,
  //               "dataKerabat": this.productInfo.value,
  //               "wbimage": this.dataBiometri,
  //             }

  //             const dataProsesApi = {
  //               "transid": this.dataLs.transid,
  //               "branchcode": this.dataLs.branchcode,
  //               "terminalid": TERMINAL.terminalID,
  //               "queuedate": this.dataLs.queuedate,
  //               "queuecode": this.dataLs.queuecode,
  //               "queueno": this.dataLs.queueno.toString(),
  //               "timestampentry": this.dataLs.timestampentry,
  //               "userid": this.dataLs.userid,
  //               "userterminal": TERMINALUSER,
  //               "trntype": "nac",
  //               "transcnt": this.dataLs.transcnt,
  //               "transeq": this.dataLs.transeq,
  //               "isCash": this.dataLs.isCash,
  //               "iscustomer": this.dataLs.iscustomer,
  //               "id": this.dataLs.id,
  //               "status": "999",
  //               "transbuff": JSON.stringify(dataTransbuff),
  //             }

  //             console.log(dataProsesApi);

  //             this.nasabahServ.accValidationNewAccount(this.headSelected, dataProsesApi).subscribe(e => {
  //               console.log(e);
  //               console.log(e['success']);
  //               // if (e[''])

  //               const dialogConfig = new MatDialogConfig();
  //               dialogConfig.data = {
  //                 id: 0,
  //                 data: e
  //               }
  //               dialogConfig.backdropClass = 'backdropBackground';
  //               dialogConfig.disableClose = true;
  //               // dialogConfig.width = '1200px';

  //               this.dialog.open(DialogSuccessComponent, dialogConfig).afterClosed().subscribe(e => {
  //                 if (e) {

  //                   let postStat = new Array;

  //                   let obj: any = new Object();
  //                   obj.transId = this.dataLs.transid;
  //                   obj.status = '000';
  //                   postStat.push(obj)

  //                   this.dialogRef.close(postStat)
  //                 }

  //               })
  //             })

  //           } else {
  //             alert('Data Kerabat belum valid')
  //           }
  //         } else {
  //           alert('Data Pekerjaan belum valid')
  //         }
  //       } else {
  //         alert('Data Pemohon belum valid')
  //       }
  //     } else {
  //       alert('Data Product Info belum valid!')
  //     }
  //   } else {
  //     alert('Head CS belum dipilih')
  //   }
  // }




}
