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

export function initializerFn(jsonAppConfigService: JsonAppConfigService) {
  return () => {
    return jsonAppConfigService.load();
  };
}

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
  ],
  entryComponents: [DialogErrorComponent, DialogTransactionComponent, HeadTellerDialogComponent, DialogNewCustomerComponent, VerifyDialogComponent],
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
  ],
  providers: [
    CryptoService, AuthenticateService, AuthGuard, JsonAppConfigService, DialogService, WebsocketService, UtilityService,
    TestService, TransactionService, SharedService, HeadService, UserDataService, NgxImageCompressService,
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