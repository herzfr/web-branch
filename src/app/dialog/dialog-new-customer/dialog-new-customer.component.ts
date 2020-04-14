import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

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
        group[key] = new FormControl(element)
      }
    }
    return new FormGroup(group);
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
        this.formServ.getVillage(this.dataPemohon.get('kabupaten').value).subscribe(e => {
          // console.log(e);
          this.dataKec = e;
          this.dataPemohon.get('kecamatan').disable()
          this.formServ.getDistrict(this.dataPemohon.get('kecamatan').value).subscribe(e => {
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
        this.formServ.getVillage(this.dataPemohon.get('kabupatenDomisili').value).subscribe(e => {
          // console.log(e);
          this.dataKec2 = e;
          this.dataPemohon.get('kecamatanDomisili').disable()
          this.formServ.getDistrict(this.dataPemohon.get('kecamatanDomisili').value).subscribe(e => {
            // console.log(e);
            this.dataKel2 = e;
            this.dataPemohon.get('kelurahanDomisili').disable()
          })
        })
      })
    })
  }



}
