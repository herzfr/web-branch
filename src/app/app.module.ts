import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CryptoService } from './services/crypto.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticateService } from './services/authenticate.service';
import { AuthGuard } from './services/auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { Page404Component } from './page404/page404.component';
import { NavigationComponent } from './navigation/navigation.component';
import { NgxBootstrapModule } from './ngx-bootstrap.module';
import { MaterialModule } from './material.modul';
import { JsonAppConfigService } from './services/json-app-config.service';
import { AppConfiguration } from './models/app.configuration';
import { NavsComponent } from './navs/navs.component';
import { LottieModule } from 'ngx-lottie';
import { DialogErrorComponent } from './dialog/dialog-error/dialog-error.component';
import { DialogService } from './services/dialog.service';
import { DialogTransactionComponent } from './dialog/dialog-transaction/dialog-transaction.component';
import { MatTableModule } from '@angular/material';
import { WebsocketService } from './services/websocket.service';
import { UtilityService } from './services/utility.service';
import { TestComponent } from './test/test.component';
import { TestService } from './test/test.service';
import { NgOtpInputModule } from 'ng-otp-input';
import { TransactionService } from './services/transaction.service';
import { SharedService } from './services/shared.service';
import { HeadTellerDialogComponent } from './dialog/head-teller-dialog/head-teller-dialog.component';
import { HeadService } from './services/head.service';
import { UserDataService } from './services/user-data.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { DialogNewCustomerComponent } from './dialog/dialog-new-customer/dialog-new-customer.component';
import { VerifyDialogComponent } from './dialog/verify-dialog/verify-dialog.component';
// import { SignaturePadModule } from 'angular2-signaturepad';
import { NasabahService } from './services/nasabah.service';
import { SignaturePadModule } from '@ng-plus/signature-pad';
import { DialogSuccessComponent } from './dialog/dialog-success/dialog-success.component';
import { HeadCsDialogComponent } from './dialog/head-cs-dialog/head-cs-dialog.component';
import { HeadConfirmComponent } from './dialog/head-confirm/head-confirm.component';
import { ConfigurationService } from './services/configuration.service';
import { TitlecustomPipe } from './pipes/titlecustom.pipe';
import { NgxCurrencyModule, CurrencyMaskInputMode } from "ngx-currency";
import { ListingService } from './services/listing.service';
import { SortbypipePipe } from './pipes/sortbypipe.pipe';
import { Titlecustom2Pipe } from './pipes/titlecustom2.pipe';
import { ValuecustomPipe } from './pipes/valuecustom.pipe';
import { AlltransactionService } from './services/alltransaction.service';
import { BannerLoadingComponent } from './banner/banner-loading/banner-loading.component';
import { LoaderService } from './services/loader.service';
import { BannerSuccessComponent } from './banner/banner-success/banner-success.component';
import { BannerRejectComponent } from './banner/banner-reject/banner-reject.component';
import { TestDialogComponent } from './dialog/test-dialog/test-dialog.component';

export function initializerFn(jsonAppConfigService: JsonAppConfigService) {
  return () => {
    return jsonAppConfigService.load();
  };
}

export const customCurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "Rp ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    Page404Component,
    NavigationComponent,
    NavsComponent,
    DialogErrorComponent,
    DialogTransactionComponent,
    TestComponent,
    HeadTellerDialogComponent,
    DialogNewCustomerComponent,
    VerifyDialogComponent,
    DialogSuccessComponent,
    HeadCsDialogComponent,
    HeadConfirmComponent,
    TitlecustomPipe,
    Titlecustom2Pipe,
    ValuecustomPipe,
    SortbypipePipe,
    BannerLoadingComponent,
    BannerSuccessComponent,
    BannerRejectComponent,
    TestDialogComponent,
  ],
  entryComponents: [TestDialogComponent, DialogErrorComponent, DialogTransactionComponent, HeadTellerDialogComponent, DialogNewCustomerComponent, VerifyDialogComponent,
    DialogSuccessComponent, HeadCsDialogComponent, HeadConfirmComponent, BannerLoadingComponent, BannerRejectComponent, BannerSuccessComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxBootstrapModule,
    MaterialModule,
    MatTableModule,
    NgOtpInputModule,
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
    SignaturePadModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
  ],
  providers: [
    CryptoService, AuthenticateService, AuthGuard, JsonAppConfigService, DialogService, WebsocketService, UtilityService,
    TestService, TransactionService, SharedService, HeadService, UserDataService, NgxImageCompressService, NasabahService,
    ConfigurationService, ListingService, AlltransactionService, LoaderService,
    {
      provide: AppConfiguration,
      deps: [HttpClient],
      useExisting: JsonAppConfigService
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [JsonAppConfigService],
      useFactory: initializerFn
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function playerFactory() {
  return import('lottie-web');
}