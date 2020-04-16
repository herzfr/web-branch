import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfiguration } from '../models/app.configuration';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    apiUrl: string;

    constructor(private http: HttpClient, private appConfiguration: AppConfiguration) {
        this.apiUrl = this.appConfiguration.ipServer;
    }

    getProvince() {
        return this.http.get(this.apiUrl + 'api/provinsi');
    }

    getCity(idProv) {
        return this.http.get(this.apiUrl + 'api/kabupaten/byProvinsi?idProvinsi=' + idProv);
    }

    getDistrict(idCity) {
        // https://localhost:8443/api/kecamatan/byKabupaten
        return this.http.get(this.apiUrl + 'api/kecamatan/byKabupaten?idKabupaten=' + idCity);
    }

    getVillage(idVillage) {
        // https://localhost:8443/api/kelurahan/byKecamatan
        return this.http.get(this.apiUrl + 'api/kelurahan/byKecamatan?idKecamatan=' + idVillage);
    }

    getPostCode(idProv) {
        // https://localhost:8443/api/kodepos?idProvinsi=11
        return this.http.get(this.apiUrl + 'api/kodepos?idProvinsi=' + idProv);
    }

    getEducation() {
        // https://localhost:8443/api/pendidikan
        return this.http.get(this.apiUrl + 'api/pendidikan');
    }

}
