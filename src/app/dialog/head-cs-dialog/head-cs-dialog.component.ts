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
  private allImage: any;

  // ENCODE / DECODE
  private ls = new securels({ encodingType: 'aes' });

  constructor(private dialogRef: MatDialogRef<HeadCsDialogComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog, private formServ: FormService,
    private sanitizer: DomSanitizer) {
    this.id = data.id
    this.dataLs = data.message;

    console.log("data ls : ", data);

    this.allImage = this.dataLs.wsbiom;
    // console.log("data : ", this.dataLs);

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
    for (const key in this.dataLs.wspinf) {
      if (this.dataLs.wspinf.hasOwnProperty(key)) {
        const element = this.dataLs.wspinf[key];
        group[key] = new FormControl(element, Validators.required)
      }
    }
    return new FormGroup(group);
  }

  getDataPemohon() {

    let group: any = {};
    for (const key in this.dataLs.wscdat) {
      if (this.dataLs.wscdat.hasOwnProperty(key)) {
        const element = this.dataLs.wscdat[key];


        switch (key) {
          case 'wslhir':
            console.log("raw element ", element);

            // var m = moment(element, 'DD-MM-YYYY', true)
            // console.log("return : ", m);


            // if (m.isValid()) {
            //   console.log(m.toDate());
            group[key] = new FormControl(element);
            // } else {
            //   group[key] = new FormControl(new Date(NaN));
            // }

            break;
          case 'wsnohp':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'wstlp1':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'wstlp2':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'wsnpwp':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/), Validators.min(100000000000000), Validators.max(999999999999999)]);
            break;
          case 'wstlhr':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
            break;
          case 'wspos1':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          case 'wspos2':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          case 'wseduc':
            group[key] = new FormControl({ value: element, disabled: true }, Validators.required);
            break;
          default:
            group[key] = new FormControl(element, Validators.required)
            break;
        }
      }
    }
    console.log("group : ", group);

    return new FormGroup(group);
  }

  getdataPekerjaan() {
    let group: any = {};
    console.log(this.dataLs.wscjob);
    for (const key in this.dataLs.wscjob) {
      if (this.dataLs.wscjob.hasOwnProperty(key)) {
        const element = this.dataLs.wscjob[key];
        switch (key) {
          case 'wsposk':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          case 'wstlpk':
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
    console.log(this.dataLs.wscfam);
    for (const key in this.dataLs.wscfam) {
      if (this.dataLs.wscfam.hasOwnProperty(key)) {
        const element = this.dataLs.wscfam[key];
        group[key] = new FormControl(element)

        switch (key) {
          case 'wstpkr':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'wstpaw':
            group[key] = new FormControl(element, [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]);
            break;
          case 'wspskr':
            group[key] = new FormControl(element, [Validators.required, Validators.min(10000), Validators.max(999999)]);
            break;
          case 'wspsaw':
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
      console.log(e);
      this.province = e;

      // GET DATA DAERAH I
      this.formServ.getCity(this.dataPemohon.get('wsprv1').value).subscribe(e => {
        // console.log(e);
        this.kabkot = e;
        console.log(this.dataPemohon);

        this.dataPemohon.get('wskot1').disable()
        this.formServ.getDistrict(this.dataPemohon.get('wskot1').value).subscribe(e => {
          // console.log(e);
          this.dataKec = e;
          this.dataPemohon.get('wskec1').disable()
          this.formServ.getVillage(this.dataPemohon.get('wskec1').value).subscribe(e => {
            // console.log(e);
            this.dataKel = e;
            this.dataPemohon.get('wskel1').disable()
          })
        })
      })


      // GET DATA DAERAH II
      this.formServ.getCity(this.dataPemohon.get('wsprv2').value).subscribe(e => {
        // console.log(e);
        this.kabkot2 = e;
        this.dataPemohon.get('wskot2').disable()
        this.formServ.getDistrict(this.dataPemohon.get('wskot2').value).subscribe(e => {
          // console.log(e);
          this.dataKec2 = e;
          this.dataPemohon.get('wskec2').disable()
          this.formServ.getVillage(this.dataPemohon.get('wskec2').value).subscribe(e => {
            // console.log(e);
            this.dataKel2 = e;
            this.dataPemohon.get('wskel2').disable()
          })
        })
      })

      // GET DATA DAERAH III
      this.formServ.getCity(this.dataPekerjaan.get('wsprvk').value).subscribe(e => {
        // console.log(e);
        this.kabkot3 = e;
        this.dataPekerjaan.get('wskotk').disable()
        this.formServ.getDistrict(this.dataPekerjaan.get('wskotk').value).subscribe(e => {
          // console.log(e);
          this.dataKec3 = e;
          this.dataPekerjaan.get('wskeck').disable()
          this.formServ.getVillage(this.dataPekerjaan.get('wskeck').value).subscribe(e => {
            // console.log(e);
            this.dataKel3 = e;
            this.dataPekerjaan.get('wskelk').disable()
          })
        })
      })

      // console.log(this.productInfo.controls);
      // console.log(this.dataPemohon.controls);
      // console.log(this.dataPekerjaan.controls);
      // console.log(this.dataKerabat.controls);


      // GET DATA DAERAH IV
      this.formServ.getCity(this.dataKerabat.get('wspvkr').value).subscribe(e => {
        // console.log(e);
        this.kabkot4 = e;
        this.dataKerabat.get('wsktkr').disable()
        this.formServ.getDistrict(this.dataKerabat.get('wsktkr').value).subscribe(e => {
          // console.log(e);
          this.dataKec4 = e;
          this.dataKerabat.get('wskckr').disable()
          this.formServ.getVillage(this.dataKerabat.get('wskckr').value).subscribe(e => {
            // console.log(e);
            this.dataKel4 = e;
            this.dataKerabat.get('wsklkr').disable()
          })
        })
      })

      // GET DATA DAERAH V
      this.formServ.getCity(this.dataKerabat.get('wspvaw').value).subscribe(e => {
        // console.log(e);
        this.kabkot5 = e;
        this.dataKerabat.get('wsktaw').disable()
        this.formServ.getDistrict(this.dataKerabat.get('wsktaw').value).subscribe(e => {
          // console.log(e);
          this.dataKec5 = e;
          this.dataKerabat.get('wskcaw').disable()
          this.formServ.getVillage(this.dataKerabat.get('wskcaw').value).subscribe(e => {
            // console.log(e);
            this.dataKel5 = e;
            this.dataKerabat.get('wsklaw').disable()
          })
        })
      })
    })

    this.dataPemohon.get('wsprv1').disable()
    this.dataPemohon.get('wsprv2').disable()
    this.dataPekerjaan.get('wsprvk').disable()
    this.dataKerabat.get('wspvkr').disable()
    this.dataKerabat.get('wspvaw').disable()
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


  photoImg() {
    if (this.allImage.wsbiom === undefined) {
      return 'assets/png/avatar.png';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allImage.wsimgs);
    }
  }

  signImg() {
    if (this.allImage.wssign === undefined) {
      return 'assets/png/signature.png';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allImage.wssign);
    }
  }

  finger1() {
    // console.log(this.allFinger);

    if (this.allImage.wsfim1 === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allImage.wsfim1);
    }
  }

  finger2() {
    // console.log(this.allFinger);
    if (this.allImage.wsfim2 === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allImage.wsfim2);
    }
  }

  finger3() {
    // console.log(this.allFinger);
    if (this.allImage.wsfim3 === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allImage.wsfim3);
    }
  }

  finger4() {
    // console.log(this.allFinger);

    if (this.allImage.wsfim4 === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allImage.wsfim4);
    }
  }

  finger5() {
    // console.log(this.allFinger);

    if (this.allImage.wsfim5 === undefined) {
      return 'assets/svgs/finger-empty.svg';
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.allImage.wsfim5);
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
