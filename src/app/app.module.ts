import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
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
import { MatTableModule } from '@angular/material';

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
    DialogErrorComponent
  ],
  entryComponents: [DialogErrorComponent],
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
    LottieModule.forRoot({ player: playerFactory, useCache: true }),
  ],
  providers: [
    CryptoService, AuthenticateService, AuthGuard, JsonAppConfigService, DialogService,
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