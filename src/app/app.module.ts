import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NotifierModule, notifierCustomConfigFactory, NotifierOptions } from "angular-notifier";
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
import { FragmentComponent } from './fragment/fragment.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'left',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 10000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    Page404Component,
    FragmentComponent
  ],
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
    NotifierModule.withConfig(customNotifierOptions),
  ],
  providers: [CryptoService, AuthenticateService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
