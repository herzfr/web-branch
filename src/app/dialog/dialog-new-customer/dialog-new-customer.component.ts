import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import * as moment from 'moment';
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
  private FormArr: FormArray;

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


  constructor(private dialogRef: MatDialogRef<DialogNewCustomerComponent>, @Inject(MAT_DIALOG_DATA) data, public dialog: MatDialog,
    private formServ: FormService) {
    // DATA AWAL
    this.dataLs = data.data;

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
    console.log(JSON.parse(this.dataLs.transbuff));
    let dataTransbuff = JSON.parse(this.dataLs.transbuff)
    let group: any = {};
    console.log(dataTransbuff.produkInfo);
    for (const key in dataTransbuff.produkInfo) {
      if (dataTransbuff.produkInfo.hasOwnProperty(key)) {
        const element = dataTransbuff.produkInfo[key];
        group[key] = new FormControl(element)
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
          default:
            group[key] = new FormControl(element)
            break;
        }
      }
    }
    return new FormGroup(group);
  }

  test() {
    console.log(this.dataPemohon.get('tanggalLahir').value);
  }

  getdataPekerjaan() {
    let dataTransbuff = JSON.parse(this.dataLs.transbuff)
    let group: any = {};
    console.log(dataTransbuff.dataPekerjaan);
    for (const key in dataTransbuff.dataPekerjaan) {
      if (dataTransbuff.dataPekerjaan.hasOwnProperty(key)) {
        const element = dataTransbuff.dataPekerjaan[key];
        group[key] = new FormControl(element)
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


}
